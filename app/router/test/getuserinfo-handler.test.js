const { getuserinfoHandler } = require('../getuserinfo-handler')

// Ein Mock-Response-Objekt mit nur den vom Handler verwendeten Methoden -
// kein echter Application Router noetig (Unit-Test der untersten Stufe
// der Testpyramide, siehe Kapitel 1.1 des Buchs).
function erzeugeResponse() {
  return {
    statusCode: undefined,
    headers: {},
    body: undefined,
    setHeader(name, value) { this.headers[name] = value },
    end(body) { this.body = body }
  }
}

// Ein syntaktisch gueltiges, aber unsigniertes JWT - jwtDecode() prueft nur
// das Format, keine Signatur.
function erzeugeJwt(nutzlast) {
  const base64url = obj => Buffer.from(JSON.stringify(obj)).toString('base64url')
  return `${base64url({ alg: 'none' })}.${base64url(nutzlast)}.`
}

describe('getuserinfoHandler', () => {
  it('lehnt eine Anfrage ohne angemeldeten Benutzer ab', () => {
    const req = { user: undefined }
    const res = erzeugeResponse()

    getuserinfoHandler(req, res)

    expect(res.statusCode).to.equal(403)
    expect(res.body).to.include('Benutzerinformationen')
  })

  it('liefert Benutzerinformationen samt dekodierten Token-Claims', () => {
    const token = erzeugeJwt({ sub: 'lea', scope: ['cnj-app.Leser'] })
    const req = {
      user: {
        id: 'lea',
        name: 'Lea',
        token: { accessToken: token }
      }
    }
    const res = erzeugeResponse()

    getuserinfoHandler(req, res)

    expect(res.statusCode).to.equal(200)
    expect(res.headers['content-type']).to.equal('application/json')

    const antwort = JSON.parse(res.body)
    expect(antwort.user.id).to.equal('lea')
    expect(antwort.user.name).to.equal('Lea')
    expect(antwort.user.details.sub).to.equal('lea')
    expect(antwort.user.details.scope).to.include('cnj-app.Leser')
  })
})
