<?php
	/*
	Plugin Name: SchmalMessage
	Description: Hörende schicken uns Nachrichten und Chris & Lena lesen diese vor
	Version: 0.3.11
	Author: Yoshy
	*/
	
	//Shortcode
	function message_shortcode() {
	ob_start(); ?>
			<div class="message">
				<message-send></message-send>
			</div>
<?php
	return ob_get_clean();
	}
	
	//Shortcode hinzufügen, um den Icecast-Stream einzubinden
	add_shortcode('message-text', 'message_shortcode');
	
	function message_script() {
		//Web-Component
		wp_enqueue_script('message', plugin_dir_url(__FILE__) . 'Messager.js', array('jquery'), '1.0', true);
		
		//wp_enqueue_script('icecast-stream-player', plugin_dir_url(__FILE__) . 'icecast-stream.js', array('jquery'), '1.0', true);
	}
	add_action('wp_enqueue_scripts', 'message_script');
	