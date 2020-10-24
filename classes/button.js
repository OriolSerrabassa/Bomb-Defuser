class Button extends Module {
    // Class constructor
    constructor(id, color, hint, completed, error, color_hover_array, color_pressed_array, button_press) {
        super(id, color, hint, completed, error)
        this.x = 192
        this.y = 192
        this.size = 300
        this.button_pressed = button_pressed
        this.text_array = ["HOLD", "DETONATE", "ABORT"]
        this.detect = false
        this.pressed = false
        this.required_pressing_time = 0
        this.start_pressing = 0
        this.end_pressing = 0
        let rng = int(random(0, color_hover_array.length))
        this.color_hover = color_hover_array[rng]
        this.color_pressed = color_pressed_array[rng]
        rng = int(random(0, this.text_array.length))
        this.text = this.text_array[rng]
        this.calculate_required_pressing_time()
    }

    // Calculate how many seconds you need to press the button to complete the module
    calculate_required_pressing_time() {
        if (red(this.color_hover) == 255 && this.text == "ABORT") this.required_pressing_time = 1
        else if (green(this.color_hover) == 255 && this.text == "DETONATE") this.required_pressing_time = 3
        else if (blue(this.color_hover) == 255) this.required_pressing_time = 2
        else if (this.text == "HOLD") this.required_pressing_time = 5
        else this.required_pressing_time = 0
    }

    // Display button whether pressed or not
    display_button() {
        stroke(0, 0, 0)
        strokeWeight(15)
        if (this.pressed) fill(this.color_pressed)
        else fill(this.color_hover)
        ellipse(this.x, this.y, this.size, this.size)
    }

    // Display button text
    display_button_text() {
        noStroke()
        textFont(title_font)
        textSize(50)
        fill(255, 255, 255)
        text(this.text, this.x, this.y)
    }

    // Deactivate Button and set it to default state
    deactivate_button() {
        this.pressed = false
    }

    // Detect user inputs
    detect_input() {
        if (keyIsDown(spacebar) && !this.detect) {
            this.detect = true
            this.pressed = true
            this.button_pressed.play()
            this.start_pressing = millis()
        }
        else if (!keyIsDown(spacebar) && this.detect) {
            this.detect = false
            this.pressed = false
            this.end_pressing = millis()
            this.calculate_pressing_time()
        }
    }

    // Check if user has pressed the button enough seconds
    calculate_pressing_time() {
        if (round((this.end_pressing - this.start_pressing) / 1000) == this.required_pressing_time) super.set_led_state(2)
        else super.play_error()
    }
}