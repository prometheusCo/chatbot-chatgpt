<?php
/**
 * Chatbot ChatGPT for WordPress - Shortcode Registration
 *
 * This file contains the code for registering the shortcode used
 * to display the Chatbot ChatGPT on the website.
 *
 * @package chatbot-chatgpt
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) )
	die;

function chatbot_chatgpt_shortcode($atts) {

    // Shortcode Attributes
    $chatbot_chatgpt_default_atts = array(
        'style' => 'floating', // Default value
    );

    // Combine user attributes with default attributes
    $atts = shortcode_atts($chatbot_chatgpt_default_atts, $atts, 'chatbot_chatgpt');

    // Use the 'style' attribute in your shortcode output
    $chatbot_chatgpt_display_style = $atts['style'];
    // echo "<p>" . $chatbot_chatgpt_display_style . "</p>";
    // Set local stoarge to the style
    ?>
    <script>
        localStorage.setItem('chatbot_chatgpt_display_style', '<?php echo $chatbot_chatgpt_display_style; ?>');
    </script>
    <?php

    // Retrieve the bot name - Ver 1.1.0
    // Add styling to the bot to ensure that it is not shown before it is needed Ver 1.2.0
    $bot_name = esc_attr(get_option('chatgpt_bot_name', 'Chatbot ChatGPT'));
    $chatgpt_chatbot_bot_prompt = esc_attr(get_option('chatgpt_chatbot_bot_prompt', 'Enter your question ...'));

    // Retrieve the custom buttons on/off setting - Ver 1.6.5
    // global $chatbot_chatgpt_enable_custom_buttons;
    // $chatbot_chatgpt_enable_custom_buttons = esc_attr(get_option('chatbot_chatgpt_enable_custom_buttons', 'Off'));

    // Depending on the style, adjust the output - Ver 1.7.1
    if ($chatbot_chatgpt_display_style == 'embedded') {
        // Code for embed style ('embedded' is the alternative style)
        ob_start();
        ?>
        <div id="chatbot-chatgpt">
        <!-- REMOVED FOR EMBEDDED -->
        <!-- <div id="chatbot-chatgpt-header">
            <div id="chatgptTitle" class="title"><?php echo $bot_name; ?></div>
        </div> -->
        <div id="chatbot-chatgpt-conversation"></div>
        <div id="chatbot-chatgpt-input">
        <input type="text" id="chatbot-chatgpt-message" placeholder="<?php echo esc_attr( $chatgpt_chatbot_bot_prompt ); ?>">
            <!-- <button id="chatbot-chatgpt-submit">Send</button> -->
            <button id="chatbot-chatgpt-submit">
                <img src="<?php echo plugins_url('../assets/icons/paper-airplane-icon.png', __FILE__); ?>" alt="Send">
            </button>
        </div>
        </div>
        <button id="chatgpt-open-btn" style="display: none;">
        <i class="dashicons dashicons-format-chat"></i>
        </button>
        <?php
        return ob_get_clean();
    } else {
        // Code for bot style ('floating' is the default style)
        ob_start();
        ?>
        <!-- Romoved styling as I believe this may cause problems with some themes Ver 1.6.6 -->
        <!-- <div id="chatbot-chatgpt" style="display: none;"> -->
        <div id="chatbot-chatgpt">
            <div id="chatbot-chatgpt-header">
                <div id="chatgptTitle" class="title"><?php echo $bot_name; ?></div>
            </div>
            <div id="chatbot-chatgpt-conversation"></div>
            <div id="chatbot-chatgpt-input">
            <input type="text" id="chatbot-chatgpt-message" placeholder="<?php echo esc_attr( $chatgpt_chatbot_bot_prompt ); ?>">
                <!-- <button id="chatbot-chatgpt-submit">Send</button> -->
                <button id="chatbot-chatgpt-submit">
                    <img src="<?php echo plugins_url('../assets/icons/paper-airplane-icon.png', __FILE__); ?>" alt="Send">
                </button>
            </div>
            <!-- Custom buttons - Ver 1.6.5 -->
            <?php
            $chatbot_chatgpt_enable_custom_buttons = 'Off'; // 'On' or 'Off'
            $chatbot_chatgpt_enable_custom_buttons = esc_attr(get_option('chatbot_chatgpt_enable_custom_buttons', 'Off'));
            // DIAG - Diagnostics - Ver 1.6.5
            // chatbot_chatgpt_back_trace( "NOTICE", '$chatbot_chatgpt_enable_custom_buttons: ' . $chatbot_chatgpt_enable_custom_buttons);
            if ($chatbot_chatgpt_enable_custom_buttons == 'On') {
                ?>
                <div id="chatboat-chatgpt-custom-buttons" style="text-align: center;">
                    <?php
                    $chatbot_chatgpt_custom_button_name_1 = '';
                    $chatbot_chatgpt_custom_button_url_1 = '';
                    $chatbot_chatgpt_custom_button_name_2 = '';
                    $chatbot_chatgpt_custom_button_url_2 = '';
                    $chatbot_chatgpt_custom_button_name_1 = get_option('chatbot_chatgpt_custom_button_name_1');
                    $chatbot_chatgpt_custom_button_url_1 = get_option('chatbot_chatgpt_custom_button_url_1');
                    $chatbot_chatgpt_custom_button_name_2 = get_option('chatbot_chatgpt_custom_button_name_2');
                    $chatbot_chatgpt_custom_button_url_2 = get_option('chatbot_chatgpt_custom_button_url_2');
                    // DIAG - Diagnostics - Ver 1.6.5
                    // chatbot_chatgpt_back_trace( "NOTICE", 'chatbot_chatgpt_custom_button_name_1: ' . $chatbot_chatgpt_custom_button_name_1);
                    // chatbot_chatgpt_back_trace( "NOTICE", 'chatbot_chatgpt_custom_button_url_1: ' . $chatbot_chatgpt_custom_button_url_1);
                    // chatbot_chatgpt_back_trace( "NOTICE", 'chatbot_chatgpt_custom_button_name_2: ' . $chatbot_chatgpt_custom_button_name_2);
                    // chatbot_chatgpt_back_trace( "NOTICE", 'chatbot_chatgpt_custom_button_url_2: ' . $chatbot_chatgpt_custom_button_url_2);
                    if (!empty($chatbot_chatgpt_custom_button_name_1) && !empty($chatbot_chatgpt_custom_button_url_1)) {
                        ?>
                        <button class="chatbot-chatgpt-custom-button-class">
                        <a href="<?php echo esc_url($chatbot_chatgpt_custom_button_url_1); ?>" target="_blank"><?php echo esc_html($chatbot_chatgpt_custom_button_name_1); ?></a>
                        </button>
                        <?php
                    }
                    if (!empty($chatbot_chatgpt_custom_button_name_2) && !empty($chatbot_chatgpt_custom_button_url_2)) {
                        ?>
                        <button class="chatbot-chatgpt-custom-button-class">
                        <a href="<?php echo esc_url($chatbot_chatgpt_custom_button_url_2); ?>" target="_blank"><?php echo esc_html($chatbot_chatgpt_custom_button_name_2); ?></a>
                        </button>
                        <?php
                    }
                    ?>
                </div>
                <?php
            }
            $chatbot_chatgpt_suppress_attribution = 'Off'; // 'On' or 'Off'
            $chatbot_chatgpt_suppress_attribution = esc_attr(get_option('chatbot_chatgpt_suppress_attribution', 'Off'));
            // DIAG - Diagnostics - Ver 1.6.5
            // chatbot_chatgpt_back_trace( "NOTICE", 'chatbot_chatgpt_suppress_attribution: ' . $chatbot_chatgpt_suppress_attribution);
            if ($chatbot_chatgpt_suppress_attribution == 'Off') {
                ?>
                <div style="text-align: center;">
                    <a href="https://kognetiks.com/wordpress-plugins/chatbot-chatgpt/?utm_source=chatbot&utm_medium=website&utm_campaign=powered_by&utm_id=plugin" target="_blank" rel="noopener noreferrer" style="text-decoration:none; font-size: 10px;"><?php echo esc_html('Chatbot & Knowledge Navigator by Kognetiks'); ?></a>
                </div>
                <?php
            }
            ?>
        </div>
        <button id="chatgpt-open-btn" style="display: none;">
        <i class="dashicons dashicons-format-chat"></i>
        </button>
        <?php
        return ob_get_clean();
    }
}

add_shortcode('chatbot_chatgpt', 'chatbot_chatgpt_shortcode');
