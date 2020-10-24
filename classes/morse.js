class Morse extends Module {
    // Class constructor
    constructor(id, color, hint, completed, error, dash, dot) {
        super(id, color, hint, completed, error)
        this.rect_size = 100
        this.line_length = 15
        this.gap = 50
        this.morse_translation = {
            A: ".-",
            B: "-...",
            G: "--.",
            M: "--",
            N: "-.",
            O: "---"
        }
        this.pattern_array = ["ODD", "EVEN", "NORMAL", "REVERSE"]
        this.pattern = this.pattern_array[int(random(0, this.pattern_array.length))]
        this.text_array = ["BANG", "BOMB", "BOOM"]
        this.text = this.text_array[int(random(0, this.text_array.length))]
        this.answer = ""
        this.user_answer = ""
        this.dash = dash
        this.dot = dot
        this.detect = false
        this.dash_button_pressed = false
        this.dot_button_pressed = false
        this.generate_answer()
    }

    // Generate the answer using the text and pattern class attributes
    generate_answer() {
        if (this.pattern == "ODD") {
            for (let i = 0; i < this.text.length; i += 2) {
                this.answer += this.morse_translation[this.text.charAt(i)]
            }
        }
        else if (this.pattern == "EVEN") {
            for (let i = 1; i < this.text.length; i += 2) {
                this.answer += this.morse_translation[this.text.charAt(i)]
            }
        }
        else if (this.pattern == "REVERSE") {
            for (let i = this.text.length - 1; i >= 0; --i) {
                this.answer += this.morse_translation[this.text.charAt(i)]
            }
        }
        else {
            for (let i = 0; i < this.text.length; ++i) {
                this.answer += this.morse_translation[this.text.charAt(i)]
            }
        }
    }

    // Display text
    display_text() {
        textFont(title_font)
        textSize(50)
        noStroke()
        fill(255, 0, 0)
        if (this.pattern == "EVEN") text("{" + this.text, this.module_width / 2, this.module_height / 3)
        else if (this.pattern == "ODD") text(this.text + "}", this.module_width / 2, this.module_height / 3)
        else if (this.pattern == "REVERSE") text("{" + this.text + "}", this.module_width / 2, this.module_height / 3)
        else text(this.text, this.module_width / 2, this.module_height / 3)
    }

    // Display dash button
    display_dash_button() {
        strokeWeight(5)
        stroke(0, 0, 0)
        if (this.dash_button_pressed) fill(128, 128, 128)
        else fill(255, 255, 255)
        rect(this.module_width / 2 - this.rect_size - this.gap / 2, this.module_height - this.rect_size - this.gap, this.rect_size, this.rect_size)
        strokeWeight(15)
        strokeCap(PROJECT)
        line(this.module_width / 2 - this.rect_size - this.gap / 2 + 35, this.module_height - this.rect_size / 2 - this.gap, this.module_width / 2 - this.rect_size - this.gap / 2 + 50 + this.line_length, this.module_height - this.rect_size / 2 - this.gap)
        strokeCap(ROUND)
    }

    // Display dot button
    display_dot_button() {
        strokeWeight(5)
        stroke(0, 0, 0)
        if (this.dot_button_pressed) fill(128, 128, 128)
        else fill(255, 255, 255)
        rect(this.module_width / 2 + this.gap / 2, this.module_height - this.rect_size - this.gap, this.rect_size, this.rect_size)
        strokeWeight(15)
        point(this.module_width / 2 + this.gap / 2 + this.rect_size / 2, this.module_height - this.rect_size / 2 - this.gap)
    }

    // Deactivate Morse and set it to default state
    deactivate_morse() {
        this.dash_button_pressed = false
        this.dot_button_pressed = false
    }

    // Detect user inputs
    detect_input() {
        if (!this.detect) {
            if (keyIsDown(f) && !this.dash_button_pressed) {
                this.dash_button_pressed = true
                this.dash.play()
                this.detect = true
                this.user_answer += "-"
                if (this.user_answer.length == this.answer.length) this.check_input()
            }
            else if (keyIsDown(g) && !this.dot_button_pressed) {
                this.dot_button_pressed = true
                this.dot.play()
                this.detect = true
                this.user_answer += "."
                if (this.user_answer.length == this.answer.length) this.check_input()
            }
        }
        else {
            if (!keyIsDown(f) && this.dash_button_pressed) {
                this.dash_button_pressed = false
                this.detect = false
            }
            else if (!keyIsDown(g) && this.dot_button_pressed) {
                this.dot_button_pressed = false
                this.detect = false
            }
        }
    }

    // Check if user input is correct
    check_input() {
        if (this.user_answer == this.answer) {
            super.set_led_state(2)
            this.deactivate_morse()
            this.display_dash_button()
            this.display_dot_button()
        }
        else {
            super.play_error()
            this.user_answer = ""
        }
    }
}