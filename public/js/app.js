(function() {
    let socket = io();
    console.log("started");

    let addButton = document.getElementsByClassName("add-user");
    addButton[0].addEventListener("click", () => {
        socket.emit("adduser");
    });

    socket.on("connectedCount", (count) => {
        let countSpan = document.getElementsByClassName('connectedCount');
        countSpan[0].innerHTML = count;
        let textSpan = document.getElementsByClassName('connectedText');
        textSpan[0].innerHTML = count === 1 ? "User connected" : "Users connected";
    });

    socket.on("data", (data) => {
        console.log("data received, renewing table");
        console.log(data);
        let newTable = document.createElement("tbody");
        newTable.setAttribute("class", "table-content");
        for(const key in data.users) {
            if(data.users.hasOwnProperty(key)) {
                let user = data.users[key];
                let tr = document.createElement("tr");
                for(const k in user) {
                    if(user.hasOwnProperty(k)) {
                        if(k === "notes") {
                            let td = document.createElement("td");
                            let btn = document.createElement("button");

                            let c = document.createAttribute("class");
                            c.value = "btn btn-primary";
                            let toggle = document.createAttribute("data-toggle");
                            toggle.value = "modal";
                            let target = document.createAttribute("data-target");
                            target.value = "#notesModal_"+user.name;
                            btn.setAttributeNode(c);
                            btn.setAttributeNode(toggle);
                            btn.setAttributeNode(target);

                            let text = document.createTextNode("Notes");
                            btn.appendChild(text);
                            td.appendChild(btn);

                            let notesModal = document.getElementById("notesModal").cloneNode(true);
                            notesModal.setAttribute("id", "notesModal_"+user.name);
                            notesModal.querySelector("#notesModalScrollableTitle").innerText = "Notes";
                            notesModal.querySelector(".modal-body").innerText = user[k];

                            td.appendChild(notesModal);
                            tr.appendChild(td);
                        } else {
                            let td = document.createElement("td");
                            let text = document.createTextNode(user[k]);
                            td.appendChild(text);
                            tr.appendChild(td);
                        }
                    }
                }
                newTable.appendChild(tr);
            }
        }
        let table = document.querySelector(".table-content");
        table.parentNode.replaceChild(newTable, table);
    })
})();