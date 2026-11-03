const { jwtDecode } = require('jwt-decode')

/**
 * Liefert Benutzerinformationen fuer das Frontend, ergaenzt um die
 * dekodierten Claims des Zugriffstokens. Aus approuter-start.js
 * herausgeloest, damit die Logik ohne einen laufenden Application Router
 * testbar ist (siehe test/getuserinfo-handler.test.js).
 */
function getuserinfoHandler(req, res) {
  if (!req.user) {
    res.statusCode = 403
    res.end('Fehler beim Laden von Benutzerinformationen!')
    return
  }

  const token = jwtDecode(req.user.token.accessToken)
  res.statusCode = 200
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({
    user: { id: req.user.id, name: req.user.name, details: token }
  }))
}

module.exports = { getuserinfoHandler }
