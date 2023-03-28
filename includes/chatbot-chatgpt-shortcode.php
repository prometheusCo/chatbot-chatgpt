<?php
/**
 * Chatbot ChatGPT for WordPress - Shortcode Registration
 *
 * This file contains the code for registering the shortcode used
 * to display the Chatbot ChatGPT on the website.
 *
 * @package chatbot-chatgpt
 */

function chatbot_chatgpt_shortcode() {
    ob_start();
    ?>
    <div id="chatbot-chatgpt">
        <div id="chatbot-chatgpt-header">
            <div id="chatgptTitle" class="title">Chatbot ChatGPT</div>
        </div>
        <div id="chatbot-chatgpt-conversation"></div>
        <div id="chatbot-chatgpt-input">
            <input type="text" id="chatbot-chatgpt-message" placeholder="<?php echo esc_attr( 'Type your message...' ); ?>">
            <button id="chatbot-chatgpt-submit">Send</button>
        </div>
    </div>
    <button id="chatgpt-open-btn">
    <i class="dashicons dashicons-format-chat"></i>
    </button>
    <?php
    return ob_get_clean();
}
add_shortcode('chatbot_chatgpt', 'chatbot_chatgpt_shortcode');