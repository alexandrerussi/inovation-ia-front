// INPUT DA MENSAGEM DIGITADA PELO USUÁRIO <input>
let inputMessage = document.getElementById("message");

// DIV ONDE IREI EXIBIR AS MENSAGENS DO USUÁRIO E DO ASSISTENTE
let chatLog = document.getElementById("chat-log");

// ARRAY QUE IRÁ SALVAR O HISTÓRICO DE MENSAGENS TROCADAS COM CHATGPT/GEMINI
let messages = [];
let messagesGemini = [];

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const messageText = inputMessage.value; // texto digitado pelo usuário

    const newMessageGPT = { "role": "user", "content": messageText }
    messages.push(newMessageGPT);

    const newMessageGemini = {
        "role": "user",
        "parts": [{ "text": messageText }],
    }
    // messages.push(newMessageGemini);


    inputMessage.value = "";

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add("message--sent");
    messageElement.innerHTML = `
        <div class="message__text">${messageText}</div>
    `;
    chatLog.appendChild(messageElement);

    // REQUISIÇÃO PARA CHATGPT
    fetch("http://localhost:3000/sendMessage/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.chat_completion.message.content);

            // ISSO AQUI É PARA CRIAR O HISTÓRICO DE MENSAGENS
            let newAssistantGPT = {"role": "assistant", "content": `${data.chat_completion.message.content}`}

            // SALVAR HISTÓRIO DE MSGS COM ASSISTENT
            messages.push(newAssistantGPT);

            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.classList.add("message--assistant");
            messageElement.innerHTML = `
                <div class="message__text">${data.chat_completion.message.content}</div>
            `;
            chatLog.appendChild(messageElement);
        });

    // REQUISIÇÃO PARA GEMINI
    // fetch("http://localhost:3000/sendMessageGemini/", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         messages
    //     })
    // })
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data.chat_completion);

    //         messages = [];

    //         const messageElement = document.createElement("div");
    //         messageElement.classList.add("message");
    //         messageElement.classList.add("message--assistant");
    //         messageElement.innerHTML = `
    //             <div class="message__text">${data.chat_completion}</div>
    //         `;
    //         chatLog.appendChild(messageElement);
    //     });
});

