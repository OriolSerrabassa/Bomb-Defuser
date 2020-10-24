class Cables extends Module {
    // Class constructor
    constructor(id, color, hint, completed, error, color_cables_array, color_cables_outline_array, wire_cutter) {
        super(id, color, hint, completed, error)
        this.cable_y = 92
        this.cable_size = 15
        this.cable_height = this.module_height * 0.5
        this.gap = 50
        this.rect_size = 25
        this.wire_cutter = wire_cutter
        this.color_cables_array = color_cables_array
        this.color_cables_outline_array = color_cables_outline_array
        this.answer_array = []
        this.position = 0
        this.key_pressed = "NONE"
        this.cut_cables_array = [false, false, false, false]
        this.detect = false
        this.generate_answer()
    }

    // Generate order to cut cables and choose cables colors
    generate_answer() {
        let rng = int(random(0, this.color_cables_array.length - 1))
        let color_cables_array_copy = this.color_cables_array.splice()
        let color_cables_outline_array_copy = this.color_cables_outline_array.splice()
        if (rng == 0) {
            color_cables_array_copy[0] = this.color_cables_array[3]
            color_cables_array_copy[1] = this.color_cables_array[2]
            color_cables_array_copy[2] = this.color_cables_array[1]
            color_cables_array_copy[3] = this.color_cables_array[0]
            color_cables_outline_array_copy[0] = this.color_cables_outline_array[3]
            color_cables_outline_array_copy[1] = this.color_cables_outline_array[2]
            color_cables_outline_array_copy[2] = this.color_cables_outline_array[1]
            color_cables_outline_array_copy[3] = this.color_cables_outline_array[0]
            this.answer_array = ["A", "S"]
        }
        else if (rng == 1) {
            color_cables_array_copy[0] = this.color_cables_array[2]
            color_cables_array_copy[1] = this.color_cables_array[3]
            color_cables_array_copy[2] = this.color_cables_array[0]
            color_cables_array_copy[3] = this.color_cables_array[1]
            color_cables_outline_array_copy[0] = this.color_cables_outline_array[2]
            color_cables_outline_array_copy[1] = this.color_cables_outline_array[3]
            color_cables_outline_array_copy[2] = this.color_cables_outline_array[0]
            color_cables_outline_array_copy[3] = this.color_cables_outline_array[1]
            this.answer_array = ["W", "S", "D"]
        }
        else {
            color_cables_array_copy[0] = this.color_cables_array[0]
            color_cables_array_copy[1] = this.color_cables_array[2]
            color_cables_array_copy[2] = this.color_cables_array[3]
            color_cables_array_copy[3] = this.color_cables_array[1]
            color_cables_outline_array_copy[0] = this.color_cables_outline_array[0]
            color_cables_outline_array_copy[1] = this.color_cables_outline_array[2]
            color_cables_outline_array_copy[2] = this.color_cables_outline_array[3]
            color_cables_outline_array_copy[3] = this.color_cables_outline_array[1]
            this.answer_array = ["W"]
        }
        this.color_cables_array = color_cables_array_copy
        this.color_cables_outline_array = color_cables_outline_array_copy
    }

    // Show cables either if they are cut or not
    display_cables() {
        for (let i = 0, cable_x = 152; i < this.color_cables_array.length; ++i, cable_x += this.gap) {
            strokeWeight(this.cable_size + 6)
            stroke(this.color_cables_outline_array[i])
            line(cable_x, this.cable_y, cable_x, this.cable_y + this.cable_height)
            strokeWeight(this.cable_size)
            stroke(this.color_cables_array[i])
            line(cable_x, this.cable_y, cable_x, this.cable_y + this.cable_height)
            if (this.cut_cables_array[i]) {
                noStroke()
                fill(this.color)
                rect(cable_x - this.rect_size / 2, this.cable_y + this.cable_height / 2 - this.rect_size / 2, this.rect_size, this.rect_size)
                strokeWeight(2)
                stroke(this.color_cables_outline_array[i])
                line(cable_x - this.cable_size / 2 - 1, this.cable_y + this.cable_height / 2 - this.rect_size / 2, cable_x + this.cable_size / 2 + 1, this.cable_y + this.cable_height / 2 - this.rect_size / 2)
                line(cable_x - this.cable_size / 2 - 1, this.cable_y + this.cable_height / 2 + this.rect_size / 2, cable_x + this.cable_size / 2 + 1, this.cable_y + this.cable_height / 2 + this.rect_size / 2)
            }
        }
    }

    // Detect and check if user input is correct
    check_cables() {
        this.key_pressed = "NONE"
        if (keyIsDown(w) && !this.cut_cables_array[0]) {
            this.key_pressed = "W"
            this.cut_cables_array[0] = true
            this.wire_cutter.play()
        }
        else if (keyIsDown(a) && !this.cut_cables_array[1]) {
            this.key_pressed = "A"
            this.cut_cables_array[1] = true
            this.wire_cutter.play()
        }
        else if (keyIsDown(s) && !this.cut_cables_array[2]) {
            this.key_pressed = "S"
            this.cut_cables_array[2] = true
            this.wire_cutter.play()
        }
        else if (keyIsDown(d) && !this.cut_cables_array[3]) {
            this.key_pressed = "D"
            this.cut_cables_array[3] = true
            this.wire_cutter.play()
        }
        if (this.position != this.answer_array.length) {
            if (this.key_pressed == this.answer_array[this.position]) {
                ++this.position
                this.key_pressed = "NONE"
            }
            else if (this.key_pressed != "NONE") super.set_led_state(1)
        }
        else {
            super.set_led_state(2)
            ++hints
        }
    }
}