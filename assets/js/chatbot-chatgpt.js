jQuery(document).ready(function ($) {

    var messageInput = $('#chatbot-chatgpt-message');
    var conversation = $('#chatbot-chatgpt-conversation');
    var submitButton = $('#chatbot-chatgpt-submit');

    // Set bot width with the default Narrow or from setting Wide - Ver 1.4.2
    var chatgpt_width_setting = localStorage.getItem('chatgpt_width_setting') || 'Narrow';

    var chatGptChatBot = $('#chatbot-chatgpt');
    if (chatgpt_width_setting === 'Wide') {
        chatGptChatBot.addClass('wide');
    } else {
        chatGptChatBot.removeClass('wide');
    }

    // DIAG - Diagnostics = Ver 1.4.2
    // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
    //     console.log('FUNCTION: chatbot-chatgpt.js');
    // }

    var chatGptOpenButton = $('#chatgpt-open-btn');
    // Use 'open' for an open chatbot or 'closed' for a closed chatbot - Ver 1.1.0
    var chatgpt_start_status = 'closed';
    
    // Initially hide the chatbot - Ver 1.1.0
    chatGptChatBot.hide();
    chatGptOpenButton.show();

    var chatbotContainer = $('<div></div>').addClass('chatbot-container');
    var chatbotCollapseBtn = $('<button></button>').addClass('chatbot-collapse-btn').addClass('dashicons dashicons-format-chat'); // Add a collapse button
    var chatbotCollapsed = $('<div></div>').addClass('chatbot-collapsed'); // Add a collapsed chatbot icon dashicons-format-chat f125

    // Avatar file locations - Ver 1.5.0
    var pluginUrl = plugin_vars.pluginUrl;

    // Avatar and Custom Message - Ver 1.5.0
    var selectedAvatar = localStorage.getItem('chatgpt_avatar_icon_setting');
    
    if (selectedAvatar && selectedAvatar !== 'icon-000.png') {
        // Construct the path to the avatar
        var avatarPath = pluginUrl + '/assets/icons/' + selectedAvatar;
        
        // If an avatar is selected and it's not 'icon-000.png', use the avatar
        var avatarImg = $('<img>').attr('id', 'chatgpt_avatar_icon_setting').attr('class', 'chatbot-avatar').attr('src', avatarPath);
    
        // Get the stored greeting message. If it's not set, default to a custom value.
        var avatarGreeting = localStorage.getItem('chatgpt_avatar_greeting_setting') || 'Howdy!!! Great to see you today! How can I help you?';

        // Revised to address cross-site scripting - Ver 1.6.4
        // // Create a bubble with the greeting message
        // var bubble = $('<div>').text(avatarGreeting).addClass('chatbot-bubble');
    
        // // Append the avatar and the bubble to the button and apply the class for the avatar icon
        // chatGptOpenButton.empty().append(avatarImg, bubble).addClass('avatar-icon');

        // IDEA - Add option to suppress avatar greeting in setting options page
        // IDEA - If blank greeting, don't show the bubble
        // IDEA - Add option to suppress avatar greeting if clicked on

        // Sanitize the avatarGreeting variable
        var sanitizedGreeting = $('<div>').text(avatarGreeting).html();

        // Create a bubble with the sanitized greeting message
        var bubble = $('<div>').html(sanitizedGreeting).addClass('chatbot-bubble');

        // Append the avatar and the bubble to the button and apply the class for the avatar icon
        chatGptOpenButton.empty().append(avatarImg, bubble).addClass('avatar-icon');

    } else {
        // If no avatar is selected or the selected avatar is 'icon-000.png', use the dashicon
        // Remove the avatar-icon class (if it was previously added) and add the dashicon class
        chatGptOpenButton.empty().removeClass('avatar-icon').addClass('dashicons dashicons-format-chat dashicon');
    }
    
    
    // Support variable greetings based on setting - Ver 1.1.0
    var initialGreeting = localStorage.getItem('chatgpt_initial_greeting') || 'Hello! How can I help you today?';
    localStorage.setItem('chatgpt_initial_greeting', initialGreeting);
    var subsequentGreeting = localStorage.getItem('chatgpt_subsequent_greeting') || 'Hello again! How can I help you?';
    localStorage.setItem('chatgpt_subsequent_greeting', subsequentGreeting);
    // Handle disclaimer - Ver 1.4.1
    var chatgpt_disclaimer_setting = localStorage.getItem('chatgpt_disclaimer_setting') || 'Yes';
    var chatgpt_chatbot_bot_prompt = localStorage.getItem('chatgpt_chatbot_bot_prompt') || 'Enter your message ...';

    // Append the collapse button and collapsed chatbot icon to the chatbot container
    chatbotContainer.append(chatbotCollapseBtn);
    chatbotContainer.append(chatbotCollapsed);

    // Add initial greeting to the chatbot
    conversation.append(chatbotContainer);

    function initializeChatbot() {

        var isFirstTime = !localStorage.getItem('chatgptChatbotOpened');
        var initialGreeting;
        
        // Remove any legacy conversations that might be store in local storage for increased privacy - Ver 1.4.2
        localStorage.removeItem('chatgpt_conversation');

        if (isFirstTime) {
            initialGreeting = localStorage.getItem('chatgpt_initial_greeting') || 'Hello! How can I help you today?';

            // DIAG - Logging for Diagnostics - Ver 1.4.2
            // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
            //     console.log('FUNCTION: initializeChatbot at isFirstTime');
            // }

            // Don't append the greeting if it's already in the conversation
            if (conversation.text().includes(initialGreeting)) {
                return;
            }

            // Get the last message in the conversation - Ver 1.5.0
            var lastMessage = conversation.children().last().text();

            // Don't append the subseqent greeting if it's already in the converation - Ver 1.5.0
            if (lastMessage === subsequentGreeting) {
                return;
            }

            appendMessage(initialGreeting, 'bot', 'initial-greeting');
            localStorage.setItem('chatgptChatbotOpened', 'true');
            // Save the conversation after the initial greeting is appended - Ver 1.2.0
            sessionStorage.setItem('chatgpt_conversation', conversation.html());           

        } else {
            
            initialGreeting = localStorage.getItem('chatgpt_subsequent_greeting') || 'Hello again! How can I help you?';

            // DIAG - Logging for Diagnostics - Ver 1.4.2
            // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
            //     console.log('FUNCTION: initializeChatbot at else');
            // }

            // Don't append the greeting if it's already in the conversation
            if (conversation.text().includes(initialGreeting)) {
                return;
            }

            appendMessage(initialGreeting, 'bot', 'initial-greeting');
            localStorage.setItem('chatgptChatbotOpened', 'true');

        }

        return;

    }


    // Add chatbot header, body, and other elements - Ver 1.1.0
    var chatbotHeader = $('<div></div>').addClass('chatbot-header');
    chatGptChatBot.append(chatbotHeader);

    // Fix for Ver 1.2.0
    chatbotHeader.append(chatbotCollapseBtn);
    chatbotHeader.append(chatbotCollapsed);

    // Attach the click event listeners for the collapse button and collapsed chatbot icon
    chatbotCollapseBtn.on('click', toggleChatbot);
    chatbotCollapsed.on('click', toggleChatbot);
    chatGptOpenButton.on('click', toggleChatbot);

    function appendMessage(message, sender, cssClass) {

        var messageElement = $('<div></div>').addClass('chat-message');
        // Use HTML for the so that links are clickable - Ver 1.6.3
        var textElement = $('<span></span>').html(message);

        // Add initial greetings if first time
        if (cssClass) {
            textElement.addClass(cssClass);
        }

        if (sender === 'user') {
            messageElement.addClass('user-message');
            textElement.addClass('user-text');
        } else if (sender === 'bot') {
            messageElement.addClass('bot-message');
            textElement.addClass('bot-text');
        } else {
            messageElement.addClass('error-message');
            textElement.addClass('error-text');
        }

        messageElement.append(textElement);
        conversation.append(messageElement);

        // Add space between user input and bot response
        if (sender === 'user' || sender === 'bot') {
            var spaceElement = $('<div></div>').addClass('message-space');
            conversation.append(spaceElement);
        }

        // Ver 1.2.4
        // conversation.scrollTop(conversation[0].scrollHeight);
        conversation[0].scrollTop = conversation[0].scrollHeight;

        // Save the conversation locally between bot sessions - Ver 1.2.0
        sessionStorage.setItem('chatgpt_conversation', conversation.html());

    }

    function showTypingIndicator() {
        var typingIndicator = $('<div></div>').addClass('typing-indicator');
        var dot1 = $('<span>.</span>').addClass('typing-dot');
        var dot2 = $('<span>.</span>').addClass('typing-dot');
        var dot3 = $('<span>.</span>').addClass('typing-dot');
        
        typingIndicator.append(dot1, dot2, dot3);
        conversation.append(typingIndicator);
        conversation.scrollTop(conversation[0].scrollHeight);
    }

    function removeTypingIndicator() {
        $('.typing-indicator').remove();
    }

    submitButton.on('click', function () {
        var message = messageInput.val().trim();

        if (!message) {
            return;
        }
            
        messageInput.val('');
        appendMessage(message, 'user');

        $.ajax({
            url: chatbot_chatgpt_params.ajax_url,
            method: 'POST',
            data: {
                action: 'chatbot_chatgpt_send_message',
                message: message,
            },
            beforeSend: function () {
                showTypingIndicator();
                submitButton.prop('disabled', true);
            },
            success: function (response) {
                removeTypingIndicator();
                if (response.success) {
                    let botResponse = response.data;
                    // Revision to how disclaimers are handled - Ver 1.5.0
                    if (localStorage.getItem('chatgpt_disclaimer_setting') === 'No') {
                        const prefixes = [
                            "As an AI, ",
                            "As an AI language model, ",
                            "I am an AI language model and ",
                            "As an artificial intelligence, ",
                            "As an AI developed by OpenAI, ",
                            "As an artificial intelligence developed by OpenAI, "
                        ];
                        for (let prefix of prefixes) {
                            if (botResponse.startsWith(prefix)) {
                                botResponse = botResponse.slice(prefix.length);
                                break;
                            }
                        }
                    }
                    // IDEA Check for a URL
                    if (botResponse.includes('[URL: ')) {
                        // DIAG - Diagnostics - Ver 1.6.3
                        // console.log("URL found in bot response");
                        // let urlRegex = /\[URL: (.*?)\]/g;
                        // let link = botResponse.match(urlRegex)[0].replace('[URL: ', '').replace(']', '');

                        let link = '';
                        let urlRegex = /\[URL: (.*?)\]/g;
                        let match = botResponse.match(urlRegex);
                        if (match && match.length > 0) {
                            link = match[0].replace(/\[URL: /, '').replace(/\]/g, '');
                            console.log(link);
                        }

                        let linkElement = document.createElement('a');
                        linkElement.href = link;
                        linkElement.textContent = 'here';
                        let text = botResponse.replace(urlRegex, '');
                        let textElement = document.createElement('span');
                        textElement.textContent = text;
                        botResponse = document.createElement('div');
                        botResponse.appendChild(textElement);
                        botResponse.appendChild(linkElement);
                        botResponse.innerHTML += '.';
                        botResponse = botResponse.outerHTML;
                    }

                    // IDEA Check for double asterisks suggesting a "bold" response
                    // TODO Add a class to the bot-text span to make the text bold

                    // Return the response
                    appendMessage(botResponse, 'bot');
                } else {
                    appendMessage('Error: ' + response.data, 'error');
                }
            },
            error: function () {
                removeTypingIndicator();
                appendMessage('Error: Unable to send message', 'error');
            },
            complete: function () {
                removeTypingIndicator();
                submitButton.prop('disabled', false);
            },
        });
    });

    messageInput.on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            submitButton.trigger('click');
        }
    });

    // Add the toggleChatbot() function - Ver 1.1.0
    function toggleChatbot() {
        if (chatGptChatBot.is(':visible')) {
            chatGptChatBot.hide();
            chatGptOpenButton.show();
            localStorage.setItem('chatgptStartStatus', 'closed');
        } else {
            chatGptChatBot.show();
            chatGptOpenButton.hide();
            localStorage.setItem('chatgptStartStatus', 'open');
            loadConversation();
            scrollToBottom();
        }
    }

    // Add this function to maintain the chatbot status across page refreshes and sessions - Ver 1.1.0 and updated for Ver 1.4.1
    function loadChatbotStatus() {
        let chatgptStartStatus = localStorage.getItem('chatgptStartStatus');
        // let chatgptStartStatus = chatbotSettings.chatgptStartStatus;
        let chatgptStartStatusNewVisitor = localStorage.getItem('chatgptStartStatusNewVisitor');

        // Nuclear option to clear session conversation - Ver 1.5.0
        // Do not use unless alsolutely needed
        // DIAG - Diagnostics - Ver 1.5.0
        // nuclearOption = 'Off';
        // if (nuclearOption === 'On') {
        //     console.log('***** NUCLEAR OPTION IS ON ***** ');
        //     sessionStorage.removeItem('chatgpt_conversation');
        //     // Removed in Ver 1.6.1
        //     sessionStorage.removeItem('chatgpt_last_response');
        // }

        // DIAG - Diagnostics - Ver 1.5.0
        // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
        //     console.log('FUNCTION: loadChatbotStatus - BEFORE DECISION');
        // }

        // Decide what to do for a new visitor - Ver 1.5.0
        if (chatbotSettings.chatgptStartStatusNewVisitor === 'open') {
            if (chatgptStartStatusNewVisitor === null) {
                // Override initial status
                chatgptStartStatus = 'open';
                chatgptStartStatusNewVisitor = 'closed';
                localStorage.setItem('chatgptStartStatusNewVisitor', 'closed');
            } else {
                // Override initial status
                chatgptStartStatusNewVisitor = 'closed';
                localStorage.setItem('chatgptStartStatusNewVisitor', 'closed');
            }
        };

        // DIAG - Diagnostics - Ver 1.5.0
        // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
        //     console.log('FUNCTION: loadChatbotStatus - AFTER DECISION');
        // }
        
        // If the chatbot status is not set in local storage, use chatgpt_start_status - Ver 1.5.1
        if (chatgptStartStatus === 'closed') {
            chatGptChatBot.hide();
            chatGptOpenButton.show();
        } else {
            chatGptChatBot.show();
            chatGptOpenButton.hide();
            // Load the conversation if the chatbot is open on page load
            loadConversation();
            scrollToBottom();
        }
    }

    // Add this function to scroll to the bottom of the conversation - Ver 1.2.1
    function scrollToBottom() {
        setTimeout(() => {
            // DIAG - Diagnostics - Ver 1.5.0
            // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
            //     console.log("FUNCTION: Scrolling to bottom");
            // }
            conversation.scrollTop(conversation[0].scrollHeight);
        }, 100);  // delay of 100 milliseconds    
    }
   
    // Load conversation from local storage if available - Ver 1.2.0
    function loadConversation() {
        var storedConversation = sessionStorage.getItem('chatgpt_conversation');
        localStorage.setItem('chatgptStartStatusNewVisitor', 'Closed');
  
        // DIAG - Diagnostics - Ver 1.5.0
        // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
        //     console.log('FUNCTION: loadConversation');
        // }

        if (storedConversation) {
            // DIAG - Diagnostics - Ver 1.5.0
            // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
            //     console.log('FUNCTION: loadConversation - IN THE IF STATEMENT');
            // }

            // Check if current conversation is different from stored conversation
            if (conversation.html() !== storedConversation) {
                conversation.html(storedConversation);  // Set the conversation HTML to stored conversation
            }

            // Use setTimeout to ensure scrollToBottom is called after the conversation is rendered
            setTimeout(scrollToBottom, 0);
        } else {
            // DIAG - Diagnostics - Ver 1.5.0
            // if (chatbotSettings.chatbot_chatgpt_diagnostics === 'On') {
            //     console.log('FUNCTION: loadConversation - IN THE ELSE STATEMENT');
            // }
            initializeChatbot();
        }
    }

    // Call the loadChatbotStatus function here - Ver 1.1.0
    loadChatbotStatus(); 

    // Load the conversation when the chatbot is shown on page load - Ver 1.2.0
    // Let the convesation stay persistent in session storage for increased privacy - Ver 1.4.2
    // loadConversation();

});