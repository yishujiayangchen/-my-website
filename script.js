/* =========================================
   入长安
========================================= */

const enterBtn =
    document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    document
        .getElementById("story")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* =========================================
   鼠标光晕
========================================= */

const mouseLight =
    document.querySelector(".mouse-light");

document.addEventListener("mousemove", (e) => {

    mouseLight.style.left =
        e.clientX + "px";

    mouseLight.style.top =
        e.clientY + "px";

});


/* =========================================
   Canvas
========================================= */

const canvas =
    document.getElementById("petalCanvas");

const ctx =
    canvas.getContext("2d");

let width;
let height;


function resizeCanvas() {

    width =
        canvas.width =
        window.innerWidth;

    height =
        canvas.height =
        window.innerHeight;

}


resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   诗句库
========================================= */

const poems = [

    "春风得意马蹄疾",

    "一日看尽长安花",

    "云想衣裳花想容",

    "春风十里不如你",

    "长安一片月",

    "万户捣衣声",

    "花开堪折直须折",

    "莫待无花空折枝",

    "人间四月芳菲尽",

    "山寺桃花始盛开",

    "花间一壶酒",

    "独酌无相亲",

    "桃李春风一杯酒",

    "江湖夜雨十年灯",

    "愿得长如此",

    "年年物候新"

];


/* =========================================
   花瓣
========================================= */

class Petal {

    constructor() {

        this.reset();

        this.y =
            Math.random() *
            height;

    }


    reset() {

        this.x =
            Math.random() *
            width;

        this.y = -30;

        this.size =
            Math.random() * 7 + 4;

        this.speed =
            Math.random() * 1.2 + 0.5;

        this.wind =
            Math.random() * 0.8 - 0.4;

        this.rotation =
            Math.random() *
            Math.PI *
            2;

        this.rotationSpeed =
            Math.random() *
            0.04 -
            0.02;

        this.opacity =
            Math.random() *
            0.45 +
            0.3;

        this.sway =
            Math.random() *
            Math.PI *
            2;

    }


    update() {

        this.y +=
            this.speed;

        this.sway += 0.02;

        this.x +=
            this.wind +
            Math.sin(this.sway) *
            0.35;

        this.rotation +=
            this.rotationSpeed;


        if (
            this.y >
            height + 30
        ) {

            this.reset();

        }

    }


    draw() {

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.rotate(
            this.rotation
        );

        ctx.globalAlpha =
            this.opacity;

        ctx.fillStyle =
            "#d69a91";


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            this.size,
            this.size * 0.58,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }


    /* 点击检测 */

    contains(
        mouseX,
        mouseY
    ) {

        const distance =
            Math.sqrt(
                Math.pow(
                    mouseX - this.x,
                    2
                ) +
                Math.pow(
                    mouseY - this.y,
                    2
                )
            );


        return (
            distance <
            Math.max(
                this.size * 3,
                18
            )
        );

    }

}


/* =========================================
   创建花瓣
========================================= */

const petals = [];

const PETAL_COUNT = 55;


for (
    let i = 0;
    i < PETAL_COUNT;
    i++
) {

    petals.push(
        new Petal()
    );

}


/* =========================================
   花瓣诗句
========================================= */

function showPoem(
    x,
    y
) {

    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "poem-popup";


    /* 随机诗句 */

    const poem =
        poems[
            Math.floor(
                Math.random() *
                poems.length
            )
        ];


    popup.textContent =
        poem;


    popup.style.left =
        x + "px";


    popup.style.top =
        y + "px";


    document.body.appendChild(
        popup
    );


    /* 动画结束后删除 */

    setTimeout(() => {

        popup.remove();

    }, 2800);

}


/* =========================================
   点击 / 触摸花瓣
========================================= */

function clickPetal(
    clientX,
    clientY
) {

    /* 从后往前检测 */

    for (
        let i = petals.length - 1;
        i >= 0;
        i--
    ) {

        const petal =
            petals[i];


        if (
            petal.contains(
                clientX,
                clientY
            )
        ) {

            showPoem(
                petal.x,
                petal.y
            );


            /* 点击后让花瓣消失 */

            petal.reset();

            return true;

        }

    }


    return false;

}


/* 鼠标点击 */

canvas.addEventListener(
    "click",
    (event) => {

        clickPetal(
            event.clientX,
            event.clientY
        );

    }
);


/* 手机触摸 */

canvas.addEventListener(
    "touchstart",
    (event) => {

        const touch =
            event.touches[0];


        clickPetal(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: true
    }
);


/* =========================================
   Canvas 动画
========================================= */

function animate() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    petals.forEach(
        petal => {

            petal.update();

            petal.draw();

        }
    );


    requestAnimationFrame(
        animate
    );

}


animate();


/* =========================================
   页面滚动淡入
========================================= */

const sections =
    document.querySelectorAll(
        ".section"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


sections.forEach(
    section => {

        section.style.opacity =
            "0";

        section.style.transform =
            "translateY(40px)";

        section.style.transition =
            "opacity 1s ease, transform 1s ease";

        observer.observe(
            section
        );

    }
);