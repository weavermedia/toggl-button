/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, MutationObserver: false*/
"use strict";

(function () {
  var isStarted = false;

  function addButtonTo(elem) {
    var alink, stag, cont = $('.pill', elem);
    if (cont === null) {
      return;
    }
    alink = createLink('toggl-button basecamp');
    alink.setAttribute("data-behavior", "hover_content");

    alink.addEventListener("click", function (e) {
      var msg, btnText, color = '';

      e.preventDefault();
      if(isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start timer';
      } else {
        msg = {
          type: 'timeEntry',
          description: $('head title').text + ' - ' + $('.content_for_perma', elem).textContent
        };
        btnText = 'Stop timer';
        color = '#ff0000';
      }

      chrome.extension.sendMessage(msg);
      isStarted = !isStarted;
      alink.style.color = color;
      alink.textContent = btnText;
    });

    stag = document.createElement("span");
    cont.parentNode.appendChild(stag.appendChild(alink));

    // new button created - reset state
    isStarted = false;
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      var observer, workspace;

      observer = new MutationObserver(function (mutations) {
        var i, elems = document.querySelectorAll("section.todos li.todo:not(.toggl)");
        for (i = 0; i < elems.length; i += 1) {
          elems[i].classList.add('toggl');
        }

        for (i = 0; i < elems.length; i += 1) {
          addButtonTo(elems[i]);
        }
      });

      workspace = document.querySelector('#workspace');
      observer.observe(workspace, {childList: true, subtree: true});
      // Trigger the mutation observer for initial setup
      setTimeout(workspace.appendChild(document.createElement('a')), 500);
    }
  });

}());
