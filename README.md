# Simple Web Application Sooryn

Example Sooryn desktop app with a Dolet backend and HTML/CSS/JavaScript
frontend.

The app entry is:

```text
backend/main.dlt
```

Run from this folder after installing the Sooryn CLI:

```powershell
sooryn build
sooryn run
```

Generated files are written to:

```text
build/
```

Frontend files use the Sooryn browser bridge:

```js
window.dolet.invoke("ping", "{}")
```

When running inside CEF, Sooryn injects the real bridge. Outside CEF,
`frontend/app.js` installs a mock bridge for local UI checks.
