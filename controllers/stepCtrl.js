async function getAllSteps(uid) {
    const user = getLoggedUser();
    if (!user) {
        showMessage('danger', 'ERROR', 'Nincs bejelentkezve felhasználó');
        return;
    }

    const targetUid = uid || user.ID;

    // A böngésző fetch API-ja GET metódusnál nem enged body-t küldeni,
    // ezért a luid-ot query paraméterben adjuk át. Ehhez a szerveren a
    // GET /steps/:uid végpontnak req.body.luid helyett (vagy mellett)
    // req.query.luid-ot is olvasnia kell.
    const response = await fetch(`http://localhost:3000/steps/${targetUid}?luid=${user_ID}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    if (response.status != 200) {
        showMessage('danger', 'ERROR', data.error);
    } else {
        console.log(data.results);
        dataChange(data.results);
    }
}