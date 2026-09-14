/* =========================
   入长安按钮
========================= */

const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    document.getElementById("story").scrollIntoView({
        behavior: "smooth"
    });

});


/* =========================
   鼠标光晕
========================= */

const mouseLight = document.querySelector(".mouse-light");

document.addEventListener("mousemove", (e) => {

    mouseLight.style.left = e.clientX + "px";
    mouseLight.style.top = e.clientY + "px";

});


/* =========================
   花瓣系统
========================= */

const canvas = document.getElementById("petalCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


class Petal {

    constructor() {

        this.reset();

        this.y = Math.random() * height;

    }

    reset() {

        this.x = Math.random() * width;

        this.y = -20;

        this.size =
            Math.random() * 6 + 3;

        this.speed =
            Math.random() * 1 + 0.4;

        this.wind =
            Math.random() * 0.8 - 0.4;

        this.rotation =
            Math.random() * Math.PI * 2;

        this.rotationSpeed =
            Math.random() * 0.03 - 0.015;

        this.opacity =
            Math.random() * 0.5 + 0.2;

    }

    update() {

        this.y += this.speed;

        this.x +=
            this.wind +
            Math.sin(this.y * 0.01) * 0.3;

        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {

            this.reset();

        }

    }

    draw() {

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.rotate(this.rotation);

        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = "#d49b91";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            this.size,
            this.size * 0.6,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

}


const petals = [];

const PETAL_COUNT = 45;

for (let i = 0; i < PETAL_COUNT; i++) {

    petals.push(
        new Petal()
    );

}


function animate() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    petals.forEach(petal => {

        petal.update();
        petal.draw();

    });

    requestAnimationFrame(animate);

}

animate();


/* =========================
   页面滚动淡入
========================= */

const sections =
    document.querySelectorAll(".section");

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.15
        }
    );


sections.forEach(section => {

    section.style.opacity = "0";

    section.style.transform =
        "translateY(40px)";

    section.style.transition =
        "opacity 1s ease, transform 1s ease";

    observer.observe(section);

});