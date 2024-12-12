<?php
/**
 * Plugin Name: Font Size Control
 * Description: A plugin to adjust font sizes and themes dynamically.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL2+
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue assets.
function font_size_control_enqueue_assets() {
    // Enqueue the CSS file.
    wp_enqueue_style(
        'font-size-control-style',
        plugins_url('css/style.css', __FILE__),
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'css/style.css')
    );

    // Enqueue the Google Font.
    wp_enqueue_style(
        'font-size-control-google-fonts',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
        array(),
        null
    );

    // Enqueue the JavaScript file.
    wp_enqueue_script(
        'font-size-control-script',
        plugins_url('js/script.js', __FILE__),
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'js/script.js'),
        true
    );
}
add_action( 'wp_enqueue_scripts', 'font_size_control_enqueue_assets' );