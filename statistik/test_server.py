"""Tests fuer server.py.

Alle drei externen Systeme werden ersetzt (siehe Testphilosophie in
Kapitel 1.1 des Buchs - Unit-Tests mit simulierten Antworten statt echter
Systeme):
  - cfenv.AppEnv():        liefert normalerweise Service-Bindings aus
                            VCAP_SERVICES, hier ein fest verdrahtetes Fake.
  - sap.xssec:              prueft normalerweise ein echtes JWT gegen XSUAA,
                            hier durch einen einfachen Stub ersetzt.
  - hdbcli.dbapi.connect:   normalerweise eine echte HANA-Verbindung, hier
                            ein Fake-Cursor mit fest vorgegebenen Zeilen.
"""
import server


class FakeService:
    def __init__(self, credentials):
        self.credentials = credentials


class FakeAppEnv:
    """Ersetzt cfenv.AppEnv(): liefert feste Zugangsdaten statt aus
    VCAP_SERVICES zu lesen."""

    def get_service(self, label):
        if label == 'xsuaa':
            return FakeService({'xsappname': 'cnj-app'})
        if label == 'hana':
            return FakeService({
                'host': 'db.example.test',
                'port': '443',
                'user': 'STATISTIK',
                'password': 'geheim',
                'schema': 'CNJ'
            })
        raise AssertionError(f'Unerwarteter Service: {label}')


class FakeSecurityContext:
    def __init__(self, scopes):
        self._scopes = scopes

    def check_scope(self, scope):
        return scope in self._scopes


class FakeCursor:
    def __init__(self, zeilen):
        self._zeilen = zeilen

    def execute(self, sql):
        self.letzte_abfrage = sql

    def fetchall(self):
        return self._zeilen


class FakeVerbindung:
    def __init__(self, zeilen):
        self._zeilen = zeilen

    def cursor(self):
        return FakeCursor(self._zeilen)

    def close(self):
        pass


def client(monkeypatch):
    monkeypatch.setattr(server, 'AppEnv', FakeAppEnv)
    return server.app.test_client()


def test_lehnt_anfragen_ohne_gueltiges_token_ab(monkeypatch):
    def token_ungueltig(token, credentials):
        raise Exception('Token konnte nicht geprueft werden')

    monkeypatch.setattr(server.xssec, 'create_security_context', token_ungueltig)
    antwort = client(monkeypatch).get('/statistik', headers={'Authorization': 'Bearer ungueltig'})

    assert antwort.status_code == 401


def test_lehnt_anfragen_ohne_leser_scope_ab(monkeypatch):
    monkeypatch.setattr(
        server.xssec, 'create_security_context',
        lambda token, credentials: FakeSecurityContext(scopes=[]))
    antwort = client(monkeypatch).get('/statistik', headers={'Authorization': 'Bearer gueltig'})

    assert antwort.status_code == 403


def test_liefert_die_statistik_fuer_einen_leser(monkeypatch):
    monkeypatch.setattr(
        server.xssec, 'create_security_context',
        lambda token, credentials: FakeSecurityContext(scopes=['$XSAPPNAME.Leser']))

    zeilen = [
        ('11111111-1111-1111-1111-111111111111', 3, 4.0),
        ('22222222-2222-2222-2222-222222222222', 1, 2.0),
    ]
    monkeypatch.setattr(server.dbapi, 'connect', lambda **kw: FakeVerbindung(zeilen))

    antwort = client(monkeypatch).get('/statistik', headers={'Authorization': 'Bearer gueltig'})

    assert antwort.status_code == 200
    daten = antwort.get_json()
    assert daten == [
        {'quelle': '11111111-1111-1111-1111-111111111111', 'anzahl': 3, 'durchschnitt': 4.0},
        {'quelle': '22222222-2222-2222-2222-222222222222', 'anzahl': 1, 'durchschnitt': 2.0},
    ]


def test_setzt_einen_fehlenden_durchschnitt_auf_null(monkeypatch):
    # CNJ_WITZSTATISTIK() liefert NULL, wenn eine Quelle nur unbewertete
    # Witze hat (AVG() ueber keine Werte). Das darf nicht zu einem
    # Serverfehler beim Erstellen der JSON-Antwort fuehren.
    monkeypatch.setattr(
        server.xssec, 'create_security_context',
        lambda token, credentials: FakeSecurityContext(scopes=['$XSAPPNAME.Leser']))
    monkeypatch.setattr(
        server.dbapi, 'connect',
        lambda **kw: FakeVerbindung([('33333333-3333-3333-3333-333333333333', 2, None)]))

    antwort = client(monkeypatch).get('/statistik', headers={'Authorization': 'Bearer gueltig'})

    assert antwort.status_code == 200
    assert antwort.get_json()[0]['durchschnitt'] == 0.0


def test_gibt_serverfehler_weiter_wenn_hana_nicht_erreichbar_ist(monkeypatch):
    monkeypatch.setattr(
        server.xssec, 'create_security_context',
        lambda token, credentials: FakeSecurityContext(scopes=['$XSAPPNAME.Leser']))

    def nicht_erreichbar(**kw):
        raise ConnectionError('HANA nicht erreichbar')

    monkeypatch.setattr(server.dbapi, 'connect', nicht_erreichbar)

    antwort = client(monkeypatch).get('/statistik', headers={'Authorization': 'Bearer gueltig'})

    assert antwort.status_code == 500
