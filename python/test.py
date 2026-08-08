import vease_scripting

client = vease_scripting.VeaseScripting("http://localhost:3000")
client.data.load(
    "/home/arnaud/Code/GeodeWeb-Workspaces/Vease/Vease/tests/e2e/tests/data/test.og_edc3d"
)
