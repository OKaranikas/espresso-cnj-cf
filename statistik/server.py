import os

from flask import Flask, abort, jsonify, request
from cfenv import AppEnv
from hdbcli import dbapi
from sap import xssec

app = Flask(__name__)


# Statt Benutzer- und Datenbankdaten wie zuvor einmalig beim Import des
# Moduls zu ermitteln, geschieht das jetzt je Anfrage in diesen beiden
# Funktionen. Ein Import von server.py haengt so nicht mehr an eine bereits
# vorhandene VCAP_SERVICES-Umgebung voraus (die es z. B. in Tests und in der
# CI nicht gibt), und Tests koennen AppEnv per Monkeypatching ersetzen, ohne
# echtes XSUAA/HANA (siehe Testphilosophie in Kapitel 1.1 des Buchs).
def _uaa_credentials():
    return AppEnv().get_service(label='xsuaa').credentials


def _hana_credentials():
    return AppEnv().get_service(label='hana').credentials


@app.route('/statistik')
def statistik():
    token = request.headers.get('Authorization', '')[7:]
    try:
        kontext = xssec.create_security_context(token, _uaa_credentials())
    except Exception:
        abort(401)
    if not kontext.check_scope('$XSAPPNAME.Leser'):
        abort(403)

    hana = _hana_credentials()
    verbindung = dbapi.connect(
        address=hana['host'],
        port=int(hana['port']),
        user=hana['user'],
        password=hana['password'],
        currentSchema=hana['schema'],
        encrypt=True,
        sslValidateCertificate=True)
    try:
        cursor = verbindung.cursor()
        cursor.execute(
            'SELECT QUELLE_ID, ANZAHL, DURCHSCHNITT '
            'FROM CNJ_WITZSTATISTIK()')
        zeilen = cursor.fetchall()
    finally:
        verbindung.close()

    return jsonify([
        {'quelle': z[0], 'anzahl': z[1], 'durchschnitt': float(z[2] or 0)}
        for z in zeilen
    ])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
