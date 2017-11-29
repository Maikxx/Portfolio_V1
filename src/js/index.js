// DOM Module - Handles all events that belong to the header.
(function Header() {
    // Define all the necessary variables.
    const navHeader = document.getElementsByTagName('header')[0],
        listItems = navHeader.getElementsByTagName('li');

    let eTar;

    // Removes the current active classes from the anchor that is passed in by the previous function.
    let _removeActives = function () {
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].classList.contains('js-active') ? listItems[i].classList.remove('js-active') : false;
        }
    }

    // Add the active class to the anchor that is clicked on, after all active classes are removed.
    let addActive = function () {
        _removeActives();
        eTar.classList.add('js-active');
    }

    // Function that handles getting the corresponding scroll to element, based on the click.
    let scrollTo = function () {
        let STE = new scrollToElement();
        STE.smoothScroll(eTar.dataset.scrollTarget);
    }

    for (var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', function () {
            eTar = this;
            addActive();
            scrollTo();
        });
    }
})();

// DOM Module - Handles the carousel events.
(function Carousel() {
    // Defining all the necessary variables.
    const carousel = document.getElementsByClassName('carousel')[0];

    const carImages = document.getElementsByClassName('car-img'),
        carImgOne = carImages[2],
        carImgTwo = carImages[1],
        carImgThree = carImages[0];

    const carBtns = document.getElementsByClassName('car-btn'),
        carBtnPrev = carBtns[0],
        carBtnNext = carBtns[1];

    let carCounter = 1,
        carTimer = 4000;

    // Interval - Starts the loop.
    let beginCarLoop = setInterval(() => carLoop(), carTimer);

    // Get the width of the carousel.
    let _defineCarWidth = function () {
        let carWidth = carousel.clientWidth;
        return carWidth;
    };

    // Get the right value of the slides.
    let _defineCarRightValue = function () {
        let carRightValue = _defineCarWidth();
        return carRightValue;
    };

    // Create the styling for the carousel images.
    let _setStyles = function (currID, nextID, prevID, nextCount, reverse) {
        let carRightValue = _defineCarRightValue();
        nextID.style.opacity = '0';
        setTimeout(() => {
            currID.style.right = '0';
            currID.style.zIndex = '10';
            if (!reverse || undefined) {
                nextID.style.right = `-${carRightValue}px`;
                nextID.style.zIndex = '15';
                prevID.style.right = `${carRightValue}px`;
                prevID.style.zIndex = '5';
            } else {
                nextID.style.right = `${carRightValue}px`;
                nextID.style.zIndex = '5';
                prevID.style.right = `-${carRightValue}px`;
                prevID.style.zIndex = '15';
            }
        }, 500);

        setTimeout(() => nextID.style.opacity = '1', 1000);
        carCounter = nextCount;
    };

    // Handles current slides and passes it to the styles function.
    let carLoop = function (reverse = false) {
        if (!reverse || undefined) {
            switch (carCounter) {
                case 1:
                    _setStyles(carImgOne, carImgTwo, carImgThree, 2, reverse);
                    break;
                case 2:
                    _setStyles(carImgTwo, carImgThree, carImgOne, 3, reverse);
                    break;
                case 3:
                    _setStyles(carImgThree, carImgOne, carImgTwo, 1, reverse);
            }
        } else {
            switch (carCounter) {
                case 1:
                    _setStyles(carImgOne, carImgThree, carImgTwo, 2, reverse);
                    break;
                case 2:
                    _setStyles(carImgThree, carImgTwo, carImgOne, 3, reverse);
                    break;
                case 3:
                    _setStyles(carImgTwo, carImgOne, carImgThree, 1, reverse);
            }
        }
    }

    carBtnPrev.addEventListener('click', () => carLoop(true));

    carousel.addEventListener('mouseenter', () => clearInterval(beginCarLoop));
    carousel.addEventListener('mouseleave', () => beginCarLoop = setInterval(() => carLoop(), carTimer));

    carBtnNext.addEventListener('click', () => carLoop());

    window.addEventListener('load', () => _defineCarWidth());
})();

// DOM Module - handles all events that belong to the contact form.
(function Contact() {
    (function activateInputFields() {
        // Defining all the necessary variables.
        const label = document.getElementsByClassName('iw-label'),
            input = document.getElementsByClassName('iw-input');

        let currentInput,
            currentLabel,
            eTar,
            jsActiveClass = 'js-active';

        // Adds classes to the required input and label.
        let _animateLabel = function () {
            currentInput.classList.add(`${jsActiveClass}`);
            currentLabel.classList.add(`${jsActiveClass}`);
        };

        // Adds a class to the message label, if this is the one targetted.
        let _animateMessageLabel = function () {
            currentLabel.classList.add(`${jsActiveClass}-message-label`);
        };

        // Figure out which label and input combinations belong to eachother.
        let _coupleLabelWithInput = function () {
            return eTar.htmlFor === currentInput.id || currentLabel.htmlFor === eTar.id ?
                (
                    _animateLabel(),
                    eTar.htmlFor === 'input-message' || eTar.id === 'input-message' ?
                    _animateMessageLabel() : false
                ) : false;
        }

        // Figures out which inputs are allready active.
        let determineIfActive = function (e, i) {
            e.preventDefault();
            currentInput = input[i];
            currentLabel = label[i];
            eTar = e.target;
            return !eTar.classList.contains('js-active') ? _coupleLabelWithInput() : false;
        }

        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener('focus', (e) => determineIfActive(e, i));
            label[i].addEventListener('click', (e) => determineIfActive(e, i));
        }
    })();
    (function formSubmission() {
        // Defining all the necessary variables.
        const mailForm = document.getElementsByClassName('form')[0],
            formMessageOutput = document.getElementById('form-message-output');

        // Get the right request type, based on the browser.
        let _createXHR = function () {
            let xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xhr;
        }

        // Determines the users input given in the form.
        let _getInput = function () {
            let name = document.getElementById('input-name').value,
                email = document.getElementById('input-email').value,
                message = document.getElementById('input-message').value;

            return {
                name: name,
                email: email,
                message: message
            }
        }

        // Makes the query string to send to PHP.
        let _setupQueryString = function () {
            let CurrentInput = new _getInput(),
                name = CurrentInput.name,
                email = CurrentInput.email,
                message = CurrentInput.message;

            let queryString = `name=${name}&email=${email}&message=${message}`;
            return queryString;
        }

        // Sends the request.
        let sendXHR = function () {
            let qS = _setupQueryString(),
                xhr = _createXHR();

            xhr.open('POST', '../php/mail.inc.php');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    formMessageOutput.insertAdjacentHTML('beforeend', `<p>${xhr.responseText}</p>`);
                    const submitButton = document.getElementById('button-submit-mail');
                    submitButton.classList.add('js-active');
                }
            }
            xhr.send(qS);
        }

        mailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendXHR();
        })
    })()
})();

// DOM Module - Handles the event that belongs to the return-to-top-button.
(function ReturnButton() {
    const el = document.getElementsByClassName('button to-top')[0],
        elC = el.classList;

    // Determine if the scroller has reached the bottom of the page.
    let isBottomReached = function () {
        if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 60)) {
            el.style.cssText += 'opacity: 1; top: -50px;';
        } else {
            el.style.cssText += 'opacity: 0; top: -40px;';
        }
    };

    el.addEventListener('click', function () {
        let STE = new scrollToElement();
        STE.smoothScroll('main-section home');
    });
    window.addEventListener('scroll', () => isBottomReached());
})();

// Function Module - A snippet that let's the page scroll smoothly to the given element.
function scrollToElement() {
    let _currentYPosition = function () {
        if (self.pageYOffset) return self.pageYOffset;
        if (document.documentElement && document.documentElement.scrollTop) {
            return document.documentElement.scrollTop;
        }
        if (document.body.scrollTop) return document.body.scrollTop;
        else return 0;
    }

    let _elmYPosition = function (eID) {
        let elm = document.getElementsByClassName(eID)[0];
        let y = elm.offsetTop;
        let node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        }
        return y;
    }

    this.smoothScroll = function (eID) {
        let startY = _currentYPosition();
        let stopY = _elmYPosition(eID);
        let distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        let speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        let step = Math.round(distance / 25);
        let leapY = stopY > startY ? startY + step : startY - step;
        let timer = 0;
        if (stopY > startY) {
            for (i = startY; i < stopY; i += step) {
                setTimeout(`window.scrollTo(0, ${leapY})`, timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        };
        for (var i = startY; i > stopY; i -= step) {
            setTimeout(`window.scrollTo(0, ${leapY})`, timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }
    }
};

function parallaxScroll(list) {
    let _createList = function (list) {
        let elList = document.getElementsByClassName(`${list}`);
        return elList;
    }

    let calculateDifference = function () {
        let elList = _createList(list),
            elAndWindowDifference,
            el;

        for (var i = 0; i < elList.length; i++) {
            el = elList[i];
            elAndWindowDifference = el.getBoundingClientRect().top - window.innerHeight;
            elAndWindowDifference < 5 && elAndWindowDifference > -100 ? el.classList.add('js-animate') : false;
        }
    };
    return calculateDifference;
};
window.addEventListener('scroll', parallaxScroll('division-line'));