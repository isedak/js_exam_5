const urlApi = 'http://146.185.154.90:8000/blog/isedak81@gmail.com/';
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

let localName = '';
let localLastName = '';
let lastDate = '';

const background = document.querySelector('.background');
const contentBox = document.querySelector('#content-box');

const errorPopUp = document.querySelector('#error-popUp');
const editPopUp = document.querySelector('#edit-popUp');
const subscribePopUp = document.querySelector('#subscribe-popUp');
const deletePopUp = document.querySelector('#delete-popUp');
const errorBox = document.querySelector('#error-box');

const form = document.querySelector('#form');
const editForm = document.querySelector('#edit-form');
const subscribeForm = document.querySelector('#subscribe-form');
const deleteForm = document.querySelector('#delete-form');

const userName = document.querySelector('#name');
const lastName = document.querySelector('#last-name');

const newUserName = document.querySelector('#newUserName');
const newLastName = document.querySelector('#newLastName');

const subscribersEmail = document.querySelector('#email');

const editPopUpBtn = document.querySelector('#edit-popup-btn');
const editBtn = document.querySelector('#edit-btn');

const deletePopUpBtn = document.querySelector('#delete-popup-btn');
const deleteBtn = document.querySelector('#delete-btn');
const noBtn = document.querySelector('#not-confirmed');

const subscribePopUpBtn = document.querySelector('#subscribe-popup-btn');
const subscribeBtn = document.querySelector('#subscribe-btn');

const sendBtn = document.querySelector('#send-btn');
const messageText = document.querySelector('#message-text');

const clearResults = function() {

    contentBox.textContent = '';
    errorBox.textContent = '';
    errorPopUp.style.display = 'none';
    editPopUp.style.display = 'none';
    subscribePopUp.style.display = 'none';
    deletePopUp.style.display = 'none';
};

const createPost = function(name, secondName, date, text) {

    let postBox = document.createElement('div');
    postBox.className = 'post-box';

    date = new Date(date);

    let day = date.getDate();
    day = day <= 9 ? '0' + day : day;

    let hours = date.getHours();
    hours = hours <= 9 ? '0' + hours : hours;

    let minutes = date.getMinutes();
    minutes = minutes <= 9 ? '0' + minutes : minutes;

    let formatedDate = `${day}.${('0' + (date.getMonth() +1)).slice(-2)}.` +
        `${date.getFullYear()} ${hours}:${minutes}`;

    postBox.innerHTML = `<div class="flex-row">` +
        `<div class="flex-column wide-column">` +
        `<p class="green-text">${name} ${secondName} <span class="grey-text">` +
        `${formatedDate}</span></p></div></div>` +
        `<p class="simple-text">${text}</p></div>`;

    return postBox;
};

const createList = function(array) {

    let result = document.createElement('div');

    result.classList.add('flex-column');
    result.classList.add('post-column');

    for (let i = 0; i < array.length; i++) {

        result.prepend(createPost(
            array[i].user.firstName, array[i].user.lastName, array[i].datetime, array[i].message));
    };
    return result;
};

const isDisplayNone = (element) => {

    let style = window.getComputedStyle(element);
    return style.display === 'none' ? true : false;
};

const createErrorMessage = function(error) {

    const paragraph = document.createElement('p');
    paragraph.className = 'error-text';
    paragraph.textContent = `${error}`;
    return paragraph;
};

const showError = function(error) {

    if (isDisplayNone(errorPopUp)) {

        errorPopUp.style.display = 'flex';
    };

    errorBox.textContent = '';
    const paragraph = createErrorMessage(error);
    errorBox.append(paragraph);
};

const getData = async(path) => {

    const data = await fetch(path);

    if (!data.ok) {

        throw new Error(`${data.status} ${data.statusText}`);
    };

    return await data.json();
};

const setAndCreateNames = async function(name, secondName) {

    localName = name;
    localLastName = secondName;

    userName.textContent = `${localName} `;
    lastName.textContent = `${localLastName}`;
};

const sendEditedNames = async(path, name, secondName) => {

    const data = new URLSearchParams();
    data.append("firstName", name);
    data.append("lastName", secondName);

    await fetch(path, {
        method: 'POST',
        body: data
    });
};

const isValidEmail = function(email) {

    return EMAIL_REGEXP.test(email) ? true : false;
};

const sendEmailToSubscribe = async(path, email) => {

    const data = new URLSearchParams();
    data.append("email", email);

    await fetch(path, {
        method: 'POST',
        body: data
    });
};

const sendMessage = async(path, message) => {

    const data = new URLSearchParams();
    data.append("message", message);

    await fetch(path, {
        method: 'POST',
        body: data
    });
};
const getAndShowMessages = async function() {

    let array = await getData(urlApi + 'posts', `?datetime=${lastDate}`);

    if (array.length) {

        if ('datetime' in array[array.length - 1]) {

            lastDate = array[array.length - 1].datetime;
            localStorage.setItem('lastDate', JSON.stringify(lastDate));
        };

        contentBox.textContent = '';
        contentBox.append(createList(array));
    };
};

document.addEventListener('DOMContentLoaded', async function() {

    clearResults();
    let interval = null;

    try {

        if (!window.navigator.onLine) {

            throw new Error('Нет подключения к интернету');
        };

        let gettedNames = await getData(urlApi + 'profile');
        setAndCreateNames(gettedNames.firstName, gettedNames.lastName);

        let savedData = localStorage.getItem('lastDate');

        if (savedData) {

            lastDate = savedData;

        } else {

            let messages = await getData(urlApi + 'posts');

            lastDate = messages[messages.length - 1].datetime;
            localStorage.setItem('lastDate', JSON.stringify(lastDate));

            contentBox.append(createList(messages));
        };

        getAndShowMessages();

        interval = setInterval(async function() {

            try {

                getAndShowMessages();

            } catch (error) {

                showError(error);
                clearInterval(interval);
            };

        }, 3000);

    } catch (error) {

        showError(error);
    };

    background.addEventListener('click', function() {

        errorBox.textContent = '';
        errorPopUp.style.display = 'none';

        editPopUp.style.display = 'none';
        subscribePopUp.style.display = 'none';
        deletePopUp.style.display = 'none';
    });

    errorPopUp.addEventListener('click', function(ev) {

        ev.stopPropagation();
        errorBox.textContent = '';
        errorPopUp.style.display = 'none';
    });

    form.addEventListener('click', function(ev) {

        ev.stopPropagation();
    });

    sendBtn.addEventListener('click', async function(ev) {

        ev.preventDefault();

        try {

            if (!window.navigator.onLine) {

                throw new Error('Нет подключения к интернету');
            };

            let messageValue = messageText.value.trim();

            if (messageValue.length) {

                if (messageValue.length > 300) {

                    messageValue = messageValue.substr(0, 300);
                };

                await sendMessage(urlApi + 'posts', messageValue);

            } else {

                throw new Error('Введите хотя бы один символ!');
            };

        } catch (error) {

            showError(error);
        };
    });

    editForm.addEventListener('click', function(ev) {

        ev.stopPropagation();
    });

    editPopUpBtn.addEventListener('click', function(ev) {

        ev.preventDefault();
        ev.stopPropagation();

        if (isDisplayNone(editPopUp)) {

            editPopUp.style.display = 'flex';
        };
    });

    editBtn.addEventListener('click', async function(ev) {

        ev.preventDefault();
        try {

            if (!window.navigator.onLine) {

                throw new Error('Нет подключения к интернету');
            };

            let nameValue = newUserName.value.trim();
            let lastNameValue = newLastName.value.trim();

            if (nameValue.length && lastNameValue.length) {

                if (nameValue.length > 50) {

                    nameValue = nameValue.substr(0, 50);
                };
                if (lastNameValue.length > 50) {

                    lastNameValue = lastNameValue.substr(0, 50);
                };
                await sendEditedNames(urlApi + 'profile', nameValue, lastNameValue);

                editPopUp.style.display = 'none';
                let gettedNames = await getData(urlApi + 'profile');
                setAndCreateNames(gettedNames.firstName, gettedNames.lastName);

            } else {

                throw new Error('Поля обязательны для заполнения!');
            };

        } catch (error) {

            showError(error);
        };
    });

    subscribeForm.addEventListener('click', function(ev) {

        ev.stopPropagation();
    });

    subscribePopUpBtn.addEventListener('click', function(ev) {

        ev.preventDefault();
        ev.stopPropagation();

        if (isDisplayNone(subscribePopUp)) {

            subscribePopUp.style.display = 'flex';
        };
    });

    subscribeBtn.addEventListener('click', async function(ev) {

        ev.preventDefault();
        try {

            if (!window.navigator.onLine) {

                throw new Error('Нет подключения к интернету');
            };

            let email = subscribersEmail.value.trim();

            if (email.length && isValidEmail(email)) {

                await sendEmailToSubscribe(urlApi + 'subscribe', email);

                subscribePopUp.style.display = 'none';

            } else {

                throw new Error('Введите e-mail!');
            };

        } catch (error) {

            showError(error);
        };
    });

    deleteForm.addEventListener('click', function(ev) {

        ev.stopPropagation();
    });

    deletePopUpBtn.addEventListener('click', function(ev) {

        ev.preventDefault();
        ev.stopPropagation();

        if (isDisplayNone(deletePopUp)) {

            deletePopUp.style.display = 'flex';
        };
    });

    deleteBtn.addEventListener('click', async function(ev) {

        ev.preventDefault();
        try {

            if (!window.navigator.onLine) {

                throw new Error('Нет подключения к интернету');
            };

            await fetch(urlApi + 'subscribe/delete', {
                method: 'POST',
                body: ''
            });

            deletePopUp.style.display = 'none';

        } catch (error) {

            showError(error);
        };
    });

    noBtn.addEventListener('click', function(ev) {

        ev.preventDefault();
        deletePopUp.style.display = 'none';
    });
});