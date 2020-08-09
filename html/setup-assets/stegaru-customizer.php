<?php
/**
 * Enqueue scripts and styles.
 */
function stegaru_scripts() {
    //jsinpage("theme-assets/js/some.js", array());
    //cssinpage("theme-assets/css/some.css", array());
}
add_action( 'wp_enqueue_scripts', 'stegaru_scripts', 20 );


function jsinpage($file_name, $page_name) {
	if(is_page($page_name) || is_single($page_name)) {
		wp_enqueue_script( str_replace(array('.', '/'), array('-', '-'), $file_name), get_theme_file_uri() . "/" . $file_name, array( 'jquery' ), false , true );
	}	
}

function cssinpage($file_name, $page_name) {
	if(is_page($page_name) || is_single($page_name)) {
		wp_enqueue_style( str_replace(array('.', '/'), array('-', '-'), $file_name), get_theme_file_uri() . "/" . $file_name );
	}	
}


// The [url] shortcode - gets the value of specific param of the url. Use like this [url param="paramname"]
function url($atts) {
    $a = shortcode_atts( array(
        'id' => '',
        'param' => ''
    ), $atts ); ?>


    <?php
        $id = $a['id'];
        $param = $a['param'];
    ?>

    <?php ob_start(); ?>
        
        <?php  
            $param_value = htmlspecialchars($_GET[$param]);
            echo $param_value
        ?>

    <?php return ob_get_clean(); ?>
<?php
}
add_shortcode( 'url', 'url' );