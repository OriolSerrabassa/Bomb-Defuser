class Module {
    // Class constructor
    constructor(id, color, hint, completed, error) {
        this.module_width = width / 3
        this.module_height = height / 2
        this.module_width_amp = id % 3
        this.module_height_amp = int(id / 3)
        this.module_x = this.module_width * this.module_width_amp
        this.module_y = this.module_height * this.module_height_amp
        this.led_state = 0
        this.color = color
        this.hint = hint
        this.completed = completed
        this.error = error
    }

    // Change default drawing position to Module position
    set_drawing_position() {
        push()
        translate(this.module_x, this.module_y)
    }

    // Set default drawing position
    clear_drawing_position() {
        pop()
    }

    // Display Module background
    display_background() {
        noStroke()
        fill(this.color)
        rect(0, 0, this.module_width, this.module_height)
    }

    // Display Module LED
    display_led() {
        if (this.led_state == 0) fill(255, 0, 0)
        else if (this.led_state == 1) fill(255, 255, 0)
        else fill(0, 255, 0)
        stroke(0, 0, 0)
        strokeWeight(5)
        ellipse(this.module_width - 50, 50, 50, 50)
    }

    // Play error sound
    play_error() {
        this.error.play()
    }

    // Change LED state
    set_led_state(state) {
        this.led_state = state
        if (this.led_state == 1) {
            this.hint.play()
            ++modules_completed
        }
        else if (this.led_state == 2) {
            this.completed.play()
            ++modules_completed
        }
    }

    // Get LED state
    get_led_state() {
        return this.led_state
    }
}