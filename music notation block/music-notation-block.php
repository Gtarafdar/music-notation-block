<?php
/**
 * Plugin Name: Music Notation Block
 * Plugin URI: https://example.com/plugins/music-notation-block
 * Description: Add musical notation to your WordPress posts using ABC notation
 * Version: 1.0.0
 * Requires at least: 5.8
 * Requires PHP: 7.2
 * Author: Gtarafdarr
 * Author URI: https://gtarafdarcom
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: music-notation-block
 */


function music_notation_enqueue() {
    wp_enqueue_script('abcjs', 
        'https://cdn.jsdelivr.net/npm/abcjs@6.2.3/dist/abcjs-basic-min.js',
        array(), '6.2.3', true
    );
}
add_action('enqueue_block_editor_assets', 'music_notation_enqueue');
add_action('wp_enqueue_scripts', 'music_notation_enqueue');

function register_music_block() {
    wp_register_script(
        'music-notation-block',
        plugins_url('build/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor')
    );

    register_block_type('music-notation-block/main', array(
        'editor_script' => 'music-notation-block'
    ));
}
add_action('init', 'register_music_block');

function render_frontend_notation() {
    if (!has_block('music-notation-block/main')) return;
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof ABCJS === 'undefined') return;
        document.querySelectorAll('.music-notation').forEach(function(div) {
           ABCJS.renderAbc(div, div.dataset.notation, {
    scale: parseFloat(div.dataset.scale) || 1.2,
    staffwidth: parseInt(div.dataset.width) || 800,
    padding: parseInt(div.dataset.padding) || 0
});
        });
    });
    </script>
    <?php
}
add_action('wp_footer', 'render_frontend_notation');