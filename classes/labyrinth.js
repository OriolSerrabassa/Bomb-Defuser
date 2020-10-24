class Labyrinth extends Module {
    // Class constructor
    constructor(id, color, hint, completed, error, player_move) {
        super(id, color, hint, completed, error)
        this.x = 92
        this.y = 92
        this.width = 200
        this.height = 200
        this.gap = this.width / 4
        this.dot_size = 10
        this.finish_size = 35
        this.player_size = 20
        this.player_x = 0
        this.player_y = 0
        this.player_move = player_move
        this.number = int(random(1, 100))
        this.detect = true
        this.direction = "NONE"
        this.labyrinth_layout = []
        this.generate_labyrinth()
    }

    // Generate labyrinth
    generate_labyrinth() {
        if (this.check_prime_number(this.number)) {
            if (this.check_odd_number(this.number)) {
                this.labyrinth_layout = [
                    ["O", "O", "X", "X", "X"],
                    ["X", "O", "X", "X", "X"],
                    ["O", "O", "X", "X", "X"],
                    ["O", "X", "O", "O", "O"],
                    ["O", "O", "O", "X", "O"]
                ]
            }
            else {
                this.labyrinth_layout = [
                    ["O", "X", "X", "X", "X"],
                    ["O", "O", "X", "X", "X"],
                    ["X", "O", "X", "X", "X"],
                    ["X", "O", "O", "X", "X"],
                    ["X", "X", "O", "O", "O"]
                ]
            }
        }
        else {
            if (this.check_odd_number(this.number)) {
                this.labyrinth_layout = [
                    ["O", "O", "O", "O", "X"],
                    ["X", "X", "X", "O", "X"],
                    ["X", "X", "O", "O", "X"],
                    ["X", "X", "O", "X", "X"],
                    ["X", "X", "O", "O", "O"]
                ]
            }
            else {
                this.labyrinth_layout = [
                    ["O", "X", "O", "O", "O"],
                    ["O", "X", "O", "X", "O"],
                    ["O", "X", "O", "X", "O"],
                    ["O", "X", "O", "X", "O"],
                    ["O", "O", "O", "X", "O"]
                ]
            }
        }
    }

    // Check if number is prime
    check_prime_number(number) {
        for (let i = 2; i <= sqrt(number); ++i) {
            if (number % i == 0) return false
        }
        return number != 1 && number != 0
    }

    // Check if number is odd
    check_odd_number(number) {
        return number % 2 != 0
    }

    // Display arrows
    display_arrows() {
        stroke(50, 50, 50)
        strokeWeight(2)
        fill(128, 128, 128) 
        triangle(145, this.y - 35, 195, this.y - 70, 245, this.y - 35)
        triangle(145, this.y + this.height + this.gap - 15, 195, this.y + this.height + this.gap + 20, 245, this.y + this.height + this.gap - 15)
        triangle(this.x - 35, this.y + 50, this.x - 70, this.y + 100, this.x - 35, this.y + 150)
        triangle(this.x + this.width + this.gap - 15, this.y + 50, this.x + this.width + this.gap + 20, this.y + 100, this.x + this.width + this.gap - 15, this.y + 150)
    }

    // Display labyrinth
    display_grid() {
        stroke(0, 50, 50)
        strokeWeight(5)
        fill(0, 128, 128)
        rect(this.x - 25, this.y - 25, this.width + this.gap, this.height + this.gap, 20)
        noStroke()
        fill(0, 0, 0)
        for (let x = 0, column = 0; x <= this.width; x += this.gap, ++column) {
            for (let y = 0, row = 0; y <= this.height; y += this.gap, ++row) {
                ellipse(this.x + x, this.y + y, this.dot_size, this.dot_size)
            }
        }
    }

    // Display finish ring
    display_finish() {
        noFill()
        stroke(0, 255, 0)
        strokeWeight(5)
        ellipse(this.x + this.width, this.y + this.height, this.finish_size, this.finish_size)
    }

    // Display player
    display_player() {
        noStroke()
        fill(255, 0, 0) 
        rect(this.x + this.player_x * this.gap - this.player_size / 2, this.y + this.player_y * this.gap - this.player_size / 2, this.player_size, this.player_size)
    }

    // Display number on bottom right corner
    display_number() {
        textFont(text_font)
        textSize(50)
        noStroke()
        fill(255, 255, 255)
        text(this.number, this.module_width - 50, this.module_height - 50)
    }

    // Detect user inputs
    detect_input() {
        if (this.detect) {
            if (mouseX < mouse_position_x) {
                this.detect = false
                this.direction = "LEFT"
                this.move_player()
            }
            else if (mouseX > mouse_position_x) {
                this.detect = false
                this.direction = "RIGHT"
                this.move_player()
            }
            else if (mouseY < mouse_position_y) {
                this.detect = false
                this.direction = "UP"
                this.move_player()
            }
            else if (mouseY > mouse_position_y) {
                this.detect = false
                this.direction = "DOWN"
                this.move_player()
            }
        }
        else {
            if (mouseX == mouse_position_x || mouseY == mouse_position_y) {
                this.detect = true
                this.direction = "NONE"
            }
        }
    }

    // Move the player through the labyrinth
    move_player() {
        if (this.direction == "LEFT" && this.player_x != 0) {
            if (this.labyrinth_layout[this.player_y][this.player_x - 1] == "O") {
                --this.player_x
                this.player_move.play()
            }
        }
        else if (this.direction == "RIGHT" && this.player_x != 4) {
            if (this.labyrinth_layout[this.player_y][this.player_x + 1] == "O") {
                ++this.player_x
                this.player_move.play()
            }
        }
        else if (this.direction == "UP" && this.player_y != 0) {
            if (this.labyrinth_layout[this.player_y - 1][this.player_x] == "O") {
                --this.player_y
                this.player_move.play()
            }
        }
        else if (this.direction == "DOWN" && this.player_y != 4) {
            if (this.labyrinth_layout[this.player_y + 1][this.player_x] == "O") {
                ++this.player_y
                this.player_move.play()
            }
        }
        if (this.player_x == 4 && this.player_y == 4) {
            super.set_led_state(2)
            this.display_grid()
            this.display_finish()
            this.display_player()
        }
    }
}