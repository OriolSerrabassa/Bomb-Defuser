// Andreu Bermúdez, Oriol Serrabassa i Ramón Vilardell

// Input variables
var mouse_position_x, mouse_position_y
const spacebar = 32
const left_arrow = 37
const up_arrow = 38
const right_arrow = 39
const down_arrow = 40
const hint_1 = 49
const hint_2 = 50
const hint_3 = 51
const hint_4 = 52
const hint_5 = 53
const hint_6 = 54
const a = 65
const d = 68
const f = 70
const g = 71
const s = 83
const w = 87

// Intro variables
var detect_intro = false
var title_font, text_font
var intro_song
var post_intro = false
var intro_background, bomb_background, percentage = 0

// Bomb variables
var start = false, pre_end = false, end = false
var bomb_song, bomb_defused, end_song
var module_colors
var morse, simon, cables, lock, labyrinth, button
var dash, dot
var hz_250, hz_500, hz_750, hz_1000
var wire_cutter
var dial_move, rotate_left, rotate_right
var player_move
var button_pressed
var module_hint, module_completed, module_error
var modules_completed = 0
var hints = 1

// Load some variables before setup()
function preload() {
    soundFormats("ogg", "mp3")
    title_font = loadFont("fonts/Top Secret.ttf")
    text_font = loadFont("fonts/SpecialElite.ttf")
    intro_song = loadSound("audios/Start.ogg")
    bomb_song = loadSound("audios/Bomb.ogg")
    bomb_defused = loadSound("audios/Bomb defused.ogg")
    end_song = loadSound("audios/End.ogg")
    dash = loadSound("audios/Dash.ogg")
    dot = loadSound("audios/Dot.ogg")
    hz_250 = loadSound("audios/250Hz.ogg")
    hz_500 = loadSound("audios/500Hz.ogg")
    hz_750 = loadSound("audios/750Hz.ogg")
    hz_1000 = loadSound("audios/1000Hz.ogg")
    wire_cutter = loadSound("audios/Wire cutter.ogg")
    dial_move = loadSound("audios/Dial move.ogg")
    player_move = loadSound("audios/Player move.ogg")
    button_pressed = loadSound("audios/Button pressed.ogg")
    module_hint = loadSound("audios/Module hint.ogg")
    module_completed = loadSound("audios/Module completed.ogg")
    module_error = loadSound("audios/Module error.ogg")
    rotate_left = loadImage("images/Rotate left.png")
    rotate_right = loadImage("images/Rotate right.png")
}

// Prepare all the other things
function setup() {
    createCanvas(1366, 768)
    noStroke()
    noCursor()
    ellipseMode(CENTER)
    textAlign(CENTER, CENTER)
    background(0, 0, 0)
    textFont(title_font)
    textSize(100)
    fill(255, 0, 0)
    text("{Bomb Defuser}", width / 2, 50)
    textFont(text_font)
    textSize(25)
    fill(255, 255, 255)
    text("Your job is to defuse the bomb so you can escape.", width / 2, 150)
    text("To do so, you will need the help of a partner.", width / 2, 200)
    text("Someone will be the defuser who will be sitting in front of this computer.", width / 2, 250)
    text("Meanwhile the other will be the support who will give instructions to the defuser.", width / 2, 300)
    text("You should have been given numerous pages which they make the manual to defuse the bomb.", width / 2, 350)
    text("Your cooperation will be esential to fulfill this mission.", width / 2, 400)
    text("You can call for outside help twice. Use it wisely.", width / 2, 450)
    text("The rest is up to you. Good luck, soldiers.", width / 2, 500)
    text("Cpt. Vilardell", width - 150, 550)
    text("Col. Bermúdez", width - 150, 600)
    text("END OF TRANSMISSION.", width / 2, 650)
    fill(255, 0, 0)
    text("Press ANY button to start.", width / 2, 725)
    setTimeout(function() {
        save_mouse_position()
        detect_intro = true
    }, 2000)
    intro_song.loop()
    intro_background = color(0, 0, 0)
    bomb_background = color(255, 255, 255)
    module_colors = [color("#33520B"), color("#17470A"), color("#524C0B"), color("#2B4F11"), color("#495914"), color("#595014"), color("#4F4111"), color("#4D480F"), color("#362F0D"), color("#164D09"), color("#33570A"), color("#57520A"), color("#17470A"), color("#33520B"), color("#524C0B"), color("#394D09"), color("#57550A"), color("#57460A")]
    morse = new Morse(0, module_colors[int(random(0, module_colors.length))], module_hint, module_completed, module_error, dash, dot)
    simon = new Simon(1, module_colors[int(random(0, module_colors.length))], module_hint, module_completed, module_error, [color(128, 0, 0), color(0, 128, 0), color(0, 0, 128), color(128, 128, 0)], [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)], [color(64, 0, 0), color(0, 64, 0), color(0, 0, 64), color(64, 64, 0)], hz_250, hz_500, hz_750, hz_1000)
    cables = new Cables(2, module_colors[int(random(0, module_colors.length))], module_hint, module_completed, module_error, [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)], [color(128, 0, 0), color(0, 128, 0), color(0, 0, 128), color(128, 128, 0)], wire_cutter)
    lock = new Lock(3, module_colors[int(random(0, module_colors.length))], module_hint, module_completed, module_error, rotate_left, rotate_right, dial_move)
    labyrinth = new Labyrinth(4, module_colors[int(random(0, module_colors.length))], module_hint, module_completed, module_error, player_move)
    button = new Button(5, module_colors[int(random(0, module_colors.length))], module_hint, module_completed, module_error, [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)], [color(128, 0, 0), color(0, 128, 0), color(0, 0, 128)], button_pressed)
}

// Save X and Y position of the mouse
function save_mouse_position() {
    mouse_position_x = mouseX
    mouse_position_y = mouseY
}

// Main loop of the program
function draw() {
    if (!post_intro && detect_intro) detect_start_input()
    else if (post_intro) {
        post_intro = false
        change_background(intro_background, bomb_background)
    }
    else if (start) {
        if (morse.get_led_state() == 0) manage_morse()
        if (simon.get_led_state() == 0) manage_simon()
        if (cables.get_led_state() == 0) manage_cables()
        if (lock.get_led_state() == 0) manage_lock()
        if (labyrinth.get_led_state() == 0) manage_labyrinth()
        if (button.get_led_state() == 0) manage_button()
        draw_grid()
        if (modules_completed == 6) {
            start = false
            pre_end = true
            bomb_song.stop()
            setTimeout(function() { finish_game() }, 1000)
        }
    }
    else if (end) {
        end = false
        textFont(title_font)
        textSize(100)
        fill(255, 0, 0)
        text("{You win}", width / 2, 250)
        textFont(text_font)
        textSize(25)
        fill(255, 255, 255)
        text("Congratulations soldiers.", width / 2, 350)
        text("You have successfully defused the bomb.", width / 2, 400)
        text("You are now free to go.", width / 2, 450)
        text("Gen. Serrabassa", width - 150, 500)
        text("END OF TRANSMISSION.", width / 2, 550)
    }
}

// Check if any bomb key has been pressed
function detect_start_input() {
    if (mouse_position_x != mouseX || mouse_position_y != mouseY || mouseIsPressed && mouseButton === LEFT || mouseIsPressed && mouseButton === RIGHT || keyIsDown(spacebar) || keyIsDown(left_arrow) || keyIsDown(up_arrow) || keyIsDown(right_arrow) || keyIsDown(down_arrow) || keyIsDown(a) || keyIsDown(d) || keyIsDown(f) || keyIsDown(g) || keyIsDown(s) || keyIsDown(w)) {
        detect_intro = false
        post_intro = true
    }
}

// Transition between backgrounds
function change_background(old_background, new_background) {
    background(lerpColor(old_background, new_background, percentage))
    percentage += 0.02
    if (pre_end) end_song.setVolume(percentage)
    else if (!start) intro_song.setVolume(1 - percentage)
    if (percentage >= 1) {
        percentage = 0
        if (pre_end) {
            background(intro_background)
            pre_end = false
            end = true
        }
        else if (!start) {
            background(bomb_background)
            intro_song.stop()
            bomb_song.loop()
            start = true
            save_mouse_position()
        }
    }
    else setTimeout(function() { change_background(old_background, new_background) }, 50)
}

// Control everything about morse object
function manage_morse() {


    morse.set_drawing_position()
    morse.detect_input()
    morse.display_background()
    morse.display_text()
    morse.display_dash_button()
    morse.display_dot_button()
    morse.display_led()
    morse.clear_drawing_position()
}

// Control everything about simon object
function manage_simon() {
    simon.set_drawing_position()
    simon.detect_input()
    simon.display_background()
    simon.display_simon()
    simon.display_led()
    simon.clear_drawing_position()
}

// Control everything about cables object
function manage_cables() {
    cables.set_drawing_position()
    cables.check_cables()
    cables.display_background()
    cables.display_cables()
    cables.display_led()
    cables.clear_drawing_position()
}

// Control everything about lock object
function manage_lock() {
    lock.set_drawing_position()
    lock.detect_input()
    lock.check_movement_done()
    lock.display_background()
    lock.display_arrows()
    lock.display_text()
    lock.display_lock()
    lock.display_line()
    lock.display_dial()
    lock.display_led()
    lock.clear_drawing_position()
}

// Control everything about labyrinth object
function manage_labyrinth() {
    labyrinth.set_drawing_position()
    labyrinth.detect_input()
    save_mouse_position()
    labyrinth.display_background()
    labyrinth.display_arrows()
    labyrinth.display_grid()
    labyrinth.display_finish()
    labyrinth.display_player()
    labyrinth.display_number()
    labyrinth.display_led()
    labyrinth.clear_drawing_position()
}

// Control everything about module_button object and button object
function manage_button() {
    button.set_drawing_position()
    button.detect_input()
    button.display_background()
    button.display_button()
    button.display_button_text()
    button.display_led()
    button.clear_drawing_position()
}

// Draw a grid to separate all modules
function draw_grid() {
    for (let x = 0; x <= width; x += width / 3) {
        for (let y = 0; y <= height; y += height / 2) {
            stroke(0, 0, 0)
            strokeWeight(15)
            line(x, 0, x, height)
            line(0, y, width, y)
        }
    }
}

// Prepare everything to finish the game
function finish_game() {
    bomb_defused.play()
    setTimeout(function() {
        change_background(bomb_background, intro_background)
        end_song.loop()
    }, 3000)
}

// Skip a Module using hints
function keyPressed() {
    if (hints != 0) {
        if (keyCode == hint_1 && morse.get_led_state() == 0) {
            morse.set_drawing_position()
            morse.deactivate_morse()
            morse.display_dash_button()
            morse.display_dot_button()
            morse.set_led_state(1)
            morse.display_led()
            morse.clear_drawing_position()
            --hints
        }
        else if (keyCode == hint_2 && simon.get_led_state() == 0) {
            simon.set_drawing_position()
            simon.deactivate_simon()
            simon.display_simon()
            simon.set_led_state(1)
            simon.display_led()
            simon.clear_drawing_position()
            --hints
        }
        else if (keyCode == hint_4 && lock.get_led_state() == 0) {
            lock.set_drawing_position()
            lock.stop_movement_loop()
            lock.set_led_state(1)
            lock.display_led()
            lock.clear_drawing_position()
            --hints
        }
        else if (keyCode == hint_5 && labyrinth.get_led_state() == 0) {
            labyrinth.set_drawing_position()
            labyrinth.set_led_state(1)
            labyrinth.display_led()
            labyrinth.clear_drawing_position()
            --hints
        }
        else if (keyCode == hint_6 && button.get_led_state() == 0) {
            button.set_drawing_position()
            button.deactivate_button()
            button.display_button()
            button.display_button_text()
            button.set_led_state(1)
            button.display_led()
            button.clear_drawing_position()
            --hints
        }
    }
    if (keyCode == hint_3 && cables.get_led_state() == 0) {
        cables.set_drawing_position()
        cables.set_led_state(1)
        cables.display_led()
        cables.clear_drawing_position()
    }
}