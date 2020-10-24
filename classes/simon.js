class Simon extends Module {
    // Class constructor
    constructor(id, color, hint, completed, error, color_hover_array, color_pressed_array, color_outline_array, hz_250, hz_500, hz_750, hz_1000) {
        super(id, color, hint, completed, error)
        this.x = this.module_width / 2
        this.y = this.module_height / 2
        this.rect_size = 100
        this.gap = 5
        this.hz_250 = hz_250
        this.hz_500 = hz_500
        this.hz_750 = hz_750
        this.hz_1000 = hz_1000
        this.color_hover_array = color_hover_array
        this.color_pressed_array = color_pressed_array
        this.color_outline_array = color_outline_array
        this.color_order_array = []
        this.pattern_array = ["OPPOSITE", "CLOCKWISE", "COUNTERCLOCKWISE", "NORMAL"]
        this.pattern = this.pattern_array[int(random(0, this.pattern_array.length))]
        this.current_length = 0
        this.answer_length = 5
        this.answer_array = []
        this.simon_array = []
        this.user_array = []
        this.timeout = null
        this.wait = true
        this.detect = false
        this.top = false
        this.left = false
        this.right = false
        this.bottom = false
        this.generate_color_order()
        this.show_pattern()
    }

    // Generate color for each button
    generate_color_order() {
        let index_array = []
        for(let i = 0; i < this.color_hover_array.length; ++i) {
            index_array.push(i)
        }
        for (let i = 0; i < this.color_hover_array.length; ++i) {
            let rng = int(random(0, index_array.length))
            this.color_order_array.push(index_array[rng])
            index_array.splice(rng, 1)
        }
    }

    // Generate new color for the sequence
    generate_new_color() {
        let rng = int(random(0, this.color_order_array.length))
        this.simon_array.push(rng)
        if (this.pattern == "OPPOSITE") {
            if (rng == 0) this.answer_array.push(this.color_order_array.length - 1)
            else if (rng == 1) this.answer_array.push(2)
            else if (rng == 2) this.answer_array.push(1)
            else this.answer_array.push(0)
        }
        else if (this.pattern == "CLOCKWISE") {
            if (rng == 0) this.answer_array.push(2)
            else if (rng == 1) this.answer_array.push(0)
            else if (rng == 2) this.answer_array.push(3)
            else this.answer_array.push(1)
        }
        else if (this.pattern == "COUNTERCLOCKWISE") {
            if (rng == 0) this.answer_array.push(1)
            else if (rng == 1) this.answer_array.push(3)
            else if (rng == 2) this.answer_array.push(0)
            else this.answer_array.push(2)
        }
        else this.answer_array.push(rng)
    }

    // Light up a button until user starts Simon
    show_pattern() {
        if (this.pattern == "OPPOSITE") this.top = true
        else if (this.pattern == "CLOCKWISE") this.left = true
        else if (this.pattern == "COUNTERCLOCKWISE") this.right = true
        else this.bottom = true
    }

    // Show simon color sequence
    show_sequence(position) {
        this.top = false
        this.left = false
        this.right = false
        this.bottom = false
        if (this.simon_array[position] == 0) {
            this.top = true
            this.hz_250.play()
        }
        else if (this.simon_array[position] == 1) {
            this.left = true
            this.hz_500.play()
        }
        else if (this.simon_array[position] == 2) {
            this.right = true
            this.hz_750.play()
        }
        else {
            this.bottom = true
            this.hz_1000.play()
        }
        if (position != this.current_length - 1) this.timeout = setTimeout(() => this.show_sequence(++position), 1000)
        else this.timeout = setTimeout(() => this.stop_sequence(), 1000)
    }

    // Finished showing simon color sequence
    stop_sequence() {
        this.top = false
        this.left = false
        this.right = false
        this.bottom = false
        this.wait = true
    }

    // Display simon
    display_simon() {
        push()
        translate(this.x, this.y)
        rotate(radians(45))
        strokeWeight(5)
        stroke(this.color_outline_array[this.color_order_array[0]])
        if (this.top) fill(this.color_pressed_array[this.color_order_array[0]])
        else fill(this.color_hover_array[this.color_order_array[0]])
        rect(-this.rect_size - this.gap, -this.rect_size - this.gap, this.rect_size, this.rect_size)
        stroke(this.color_outline_array[this.color_order_array[1]])
        if (this.left) fill(this.color_pressed_array[this.color_order_array[1]])
        else fill(this.color_hover_array[this.color_order_array[1]])
        rect(-this.rect_size - this.gap, this.gap, this.rect_size, this.rect_size)
        stroke(this.color_outline_array[this.color_order_array[2]])
        if (this.right) fill(this.color_pressed_array[this.color_order_array[2]])
        else fill(this.color_hover_array[this.color_order_array[2]])
        rect(this.gap, -this.rect_size - this.gap, this.rect_size, this.rect_size)
        stroke(this.color_outline_array[this.color_order_array[3]])
        if (this.bottom) fill(this.color_pressed_array[this.color_order_array[3]])
        else fill(this.color_hover_array[this.color_order_array[3]])
        rect(this.gap, this.gap, this.rect_size, this.rect_size)
        pop()
    }

    // Deactivate simon and set it to default mode
    deactivate_simon() {
        clearTimeout(this.timeout)
        this.top = false
        this.left = false
        this.right = false
        this.bottom = false
    }

    // Detect user inputs
    detect_input() {
        if (this.wait) {
            if (keyIsDown(up_arrow)) {
                if (this.current_length == 0) {
                    this.wait = false
                    ++this.current_length
                    this.generate_new_color()
                    this.timeout = setTimeout(() => this.show_sequence(0), 1000)
                }
                else if (!this.detect) {
                    this.detect = true
                    this.hz_250.play()
                    this.top = true
                    this.timeout = setTimeout(() => this.add_input(0), 250)
                }
            }
            else if (keyIsDown(left_arrow)) {
                if (this.current_length == 0) {
                    this.wait = false
                    ++this.current_length
                    this.generate_new_color()
                    this.timeout = setTimeout(() => this.show_sequence(0), 1000)
                }
                else if (!this.detect) {
                    this.detect = true
                    this.hz_500.play()
                    this.left = true
                    this.timeout = setTimeout(() => this.add_input(1), 250)
                }
            }
            else if (keyIsDown(right_arrow)) {
                if (this.current_length == 0) {
                    this.wait = false
                    ++this.current_length
                    this.generate_new_color()
                    this.timeout = setTimeout(() => this.show_sequence(0), 1000)
                }
                else if (!this.detect) {
                    this.detect = true
                    this.hz_750.play()
                    this.right = true
                    this.timeout = setTimeout(() => this.add_input(2), 250)
                }
            }
            else if (keyIsDown(down_arrow)) {
                if (this.current_length == 0) {
                    this.wait = false
                    ++this.current_length
                    this.generate_new_color()
                    this.timeout = setTimeout(() => this.show_sequence(0), 1000)
                }
                else if (!this.detect) {
                    this.detect = true
                    this.hz_1000.play()
                    this.bottom = true
                    this.timeout = setTimeout(() => this.add_input(3), 250)
                }
            }
            else this.detect = false
        }
    }

    // Add user input
    add_input(id) {
        if (id == 0) this.top = false
        else if (id == 1) this.left = false
        else if (id == 2) this.right = false
        else this.bottom = false
        this.user_array.push(id)
        if (this.user_array.length == this.current_length) {
            this.wait = false
            if (this.check_input()) {
                this.user_array = []
                if (this.current_length != this.answer_length) {
                    ++this.current_length
                    this.generate_new_color()
                    this.timeout = setTimeout(() => this.show_sequence(0), 1000)
                }
                else {
                    super.set_drawing_position()
                    super.set_led_state(2)
                    this.deactivate_simon()
                    this.display_simon()
                    super.display_led()
                    super.clear_drawing_position()
                }
            }
            else {
                super.play_error()
                this.user_array = []
                this.timeout = setTimeout(() => this.show_sequence(0), 1000)
            }
        }
    }

    // Check if user input is correct
    check_input() {
        for (let i = 0; i < this.current_length; ++i) {
            if (this.user_array[i] != this.answer_array[i]) return false
        }
        return true
    }
}