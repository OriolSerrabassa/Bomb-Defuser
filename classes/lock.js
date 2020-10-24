class Lock extends Module {
    // Class constructor
    constructor(id, color, hint, completed, error, rotate_left, rotate_right, move) {
        super(id, color, hint, completed, error)
        this.x = 192
        this.y = 192
        this.rotate_left = rotate_left
        this.rotate_right = rotate_right
        this.lock_size = 300
        this.dial_size = 100
        this.line_size = 25
        this.line_degrees = 0
        this.line_x = this.x + (this.dial_size * 2) / 2 * cos(this.line_degrees)
        this.line_y = this.x + (this.dial_size * 2) / 2 * sin(this.line_degrees)
        this.binary_values_array = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001"]
        this.binary_password_array = []
        this.password_array = []
        this.password_size = 5
        this.direction_array = []
        this.direction = ""
        this.move = move
        this.movement = false
        this.detect = false
        this.user_password_array = []
        this.user_direction_array = []
        this.generate_password()
    }

    // Generate a random password
    generate_password() {
        for (let i = 0; i < this.password_size; ++i) {
            if (i % 2 == 0) this.direction_array.push("CLOCKWISE")
            else this.direction_array.push("COUNTERCLOCKWISE")
            let rng = int(random(0, this.binary_values_array.length))
            this.binary_password_array.push(this.binary_values_array[rng])
            this.password_array.push(rng)
        }
    }

    // Display left and right arrows
    display_arrows() {
        image(this.rotate_left, 10, this.module_height - 112)
        image(this.rotate_right, this.lock_size - 25, this.module_height - 112)
    }

    // Display lock
    display_lock() {
        stroke(25, 25, 25)
        strokeWeight(15)
        fill(0, 0, 0)
        ellipse(this.x, this.y, this.lock_size, this.lock_size)
        stroke(255, 255, 255)
        strokeWeight(15)
        for (let a = 0, i = 0; a < 360; a += 36, ++i) {
            let angle = radians(a)
            let text_x = this.x + (this.lock_size - this.dial_size / 2) / 2 * cos(angle)
            let text_y = this.y + (this.lock_size - this.dial_size / 2) / 2 * sin(angle)
            let line_end_x = this.x + (this.lock_size - this.dial_size) / 2 * cos(angle)
            let line_end_y = this.y + (this.lock_size - this.dial_size) / 2 * sin(angle)
            textFont(text_font)
            textSize(25)
            noStroke()
            fill(255, 255, 255)
            text(i, text_x, text_y)
            stroke(255, 255, 255)
            strokeWeight(15)
            line(this.x, this.y, line_end_x, line_end_y)
        }
    }

    // Display dial
    display_dial() {
        stroke(25, 25, 25)
        strokeWeight(5)
        fill(0, 0, 0)
        ellipse(this.x, this.y, this.dial_size, this.dial_size)
    }

    // Display dial red line
    display_line() {
        stroke(255, 0, 0)
        strokeWeight(5)
        line(this.x, this.y, this.line_x, this.line_y)
    }

    // Display binary password digits
    display_text() {
        textFont(text_font)
        textSize(25)
        noStroke()
        fill(255, 255, 255)
        for (let i = this.password_size - 1, y = 100; i >= 0; --i, y += 25) {
            text(this.binary_password_array[i], this.module_width - 50, y)
        }
    }

    // Stop movement audio loop
    stop_movement_loop() {
        this.move.stop()
    }

    // Detect user inputs
    detect_input() {
        if (mouseIsPressed && mouseButton === LEFT) {
            if (!this.detect) {
                this.move.loop()
                this.movement = true
                this.detect = true
                this.direction = "CLOCKWISE"
            }
            this.line_degrees += 1
            if (this.line_degrees >= 360) this.line_degrees = 0
            this.calculate_line_position()
        }
        else if (mouseIsPressed && mouseButton === RIGHT) {
            if (!this.detect) {
                this.move.loop()
                this.movement = true
                this.detect = true
                this.direction = "COUNTERCLOCKWISE"
            }
            this.line_degrees -= 1
            if (this.line_degrees <= 0) this.line_degrees = 360
            this.calculate_line_position()
        }
        else this.detect = false
    }

    // Rotate dial red line
    calculate_line_position() {
        this.line_x = this.x + (this.dial_size * 2) / 2 * cos(radians(this.line_degrees))
        this.line_y = this.x + (this.dial_size * 2) / 2 * sin(radians(this.line_degrees))
    }

    // Check if user finished an input
    check_movement_done() {
        if (!this.detect && this.movement) {
            this.move.stop()
            this.movement = false
            this.ignore_left = false
            this.ignore_right = false
            this.calculate_movement()
        }
    }

    // Check if user input is valid
    calculate_movement() {
        let rounded_number = round(this.line_degrees / 36)
        let number = this.line_degrees / 36
        if (number < rounded_number) {
            if (number + 0.1 >= rounded_number) {
                if (rounded_number == 10) rounded_number = 0
                this.add_movement(this.direction, rounded_number)
            }
            else this.reset()
        }
        else if (number > rounded_number) {
            if (number - 0.1 <= rounded_number) {
                if (rounded_number == 10) rounded_number = 0
                this.add_movement(this.direction, rounded_number)
            }
            else this.reset()
        }
        else this.add_movement(this.direction, rounded_number)
    }

    // Add user input
    add_movement(direction, number) {
        this.user_password_array.push(number)
        this.user_direction_array.push(direction)
        if (this.user_password_array.length == this.password_array.length) {
            if (this.check_passwords()) super.set_led_state(2)
            else this.reset()
        }
    }

    // Check if user password is correct
    check_passwords() {
        for (let i = 0; i < this.password_size; ++i) {
            if (this.user_password_array[i] != this.password_array[i]) return false
            if (this.user_direction_array[i] != this.direction_array[i]) return false
        }
        return true
    }

    // Reset user inputs
    reset() {
        super.play_error()
        this.user_password_array = []
        this.user_direction_array = []
    }
}