document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main-content");
    const buttons = document.querySelectorAll(".sidebar .nav button");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const view = btn.getAttribute("data-view");
            try {
                const res = await fetch(`views/${view}`);
                const html = await res.text();
                main.innerHTML = html;
            } catch (err) {
                main.innerHTML = "<p>Lỗi tải nội dung!</p>";
                console.error(err);
            }
        });
    });
});