import vease_scripting

client = vease_scripting.VeaseScripting("http://localhost:3000")
print(client.data.load())
