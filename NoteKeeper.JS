console.clear();
console.log("📝 Welcome to my humble NoteKeeper");
console.log("----------------------------------");

const fs = require('fs');
const readline = require('readline');

console.time("⏱️ Session time");

let list = [];

try {
  if (fs.existsSync('notes.json')) {
    const data = fs.readFileSync('notes.json', 'utf8');
    list = JSON.parse(data);
  }
} catch (err) {
  console.log("⚠️ Couldn't read notes.json, starting fresh.");
}

function saveList() {
  fs.writeFileSync('notes.json', JSON.stringify(list, null, 2));
}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function notes() {
  rl.question("\n💬 What would you like to do? (create / list / view / search / edit / delete / exit): ", (answerr) => {

    let answer = answerr.trim().toLowerCase();

    switch (answer) {

      case "create":
        rl.question("🖊️ Give me a title: ", (title) => {
          if (list.some(n => n.title === title)) {
            console.log("⚠️ A note with that title already exists!");
            return notes();
          }
          rl.question("📜 Give me a body: ", (body) => {
            if (title.trim() === "" || body.trim() === "") {
              console.log("⚠️ Title or body can’t be empty!");
              return notes();
            }
            list.push({ id: Date.now(), title: title.trim(""), body: body.trim(""), date: new Date().toLocaleString() });
            saveList();
            console.clear();
            console.log(`✅ Note "${title}" created successfully!`);
            notes();
          });
        });
        break;

      case "list":
        console.clear();
        if (list.length === 0) {
          console.log("📭 You don’t have any notes yet!");
        } else {
          console.log("📚 Your Notes:");
          for (let index = 0; index < list.length; index++) {
            console.log(`${index + 1}. 📝 ${list[index].title} (${list[index].date})`);
          }
        }
        notes();
        break;

      case "view":
        rl.question("🔍 Enter note title: ", (title) => {
          let wantedNote = list.find(n => n.title === title);
          console.clear();
          if (wantedNote) {
            console.log(`🧾 ${wantedNote.title} (${wantedNote.date})\n`);
            console.log(`🗒️ ${wantedNote.body}`);
          } else {
            console.log("❌ Note not found!");
          }
          notes();
        });
        break;

      case "search":
        rl.question("🔎 Search for: ", (search) => {
          let matches = list.filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.body.toLowerCase().includes(search.toLowerCase())
            );
            
            if (matches.length > 0) {
            matches.forEach(n => {
              console.log(`🧾 ${n.title} (${n.date})`);
              console.log(`📜 ${n.body}\n`);
            });
            } else {
            console.log("🙈 No matching notes found!");
            }

          notes();
        });
        break;

      case "edit":
        rl.question("✏️ Which note do you want to edit (title): ", (title) => {
          let wantedNote = list.find(n => n.title === title);
          if (!wantedNote) {
            console.log("❌ Note not found!");
            return notes();
          }
          rl.question("🆕 New body text: ", (body) => {
            wantedNote.body = body;
            wantedNote.date = new Date().toLocaleString();
            saveList();
            console.clear();
            console.log(`✅ "${title}" has been updated!`);
            notes();
          });
        });
        break;

      case "delete":
        rl.question("🗑️ Title of note to delete: ", (title) => {
          let index = list.findIndex(n => n.title === title);
          if (index !== -1) {
            let deletedNote = list[index];
            list.splice(index, 1);
            saveList();
            console.clear();
            console.log(`🚮 "${deletedNote.title}" has been deleted.`);
          } else {
            console.log("⚠️ Note not found!");
          }
          notes();
        });
        break;

      case "exit":
        rl.close();
        console.timeEnd("⏱️ Session time");
        console.log("\n👋 Goodbye, see you next time!");
        return;

      default:
        console.clear();
        console.log("🤔 Invalid command! Try again.");
        notes();
        break;
    }
  });
}

notes();
