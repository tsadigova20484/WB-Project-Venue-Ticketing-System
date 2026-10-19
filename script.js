
const seatInfo = document.getElementById("seat-info");

const zones = [
    {
        id: "vip-seats",
        name: "VIP",
        price: 150,
        count: 12,
        className: "vip-seat"
    },
    {
        id: "premium-seats",
        name: "Premium",
        price: 80,
        count: 24,
        className: "premium-seat"
    },
    {
        id: "standard-seats",
        name: "Standard",
        price: 50,
        count: 36,
        className: "standard-seat"
    }
];

function createSeats(zone) {
    const container = document.getElementById(zone.id);

    for (let i = 1; i <= zone.count; i++) {
        const seat = document.createElement("button");

        seat.type = "button";
        seat.className = `seat ${zone.className}`;
        seat.textContent = i;
        seat.setAttribute(
            "aria-label",
            `${zone.name} seat ${i}, ${zone.price} AZN`
        );

        seat.addEventListener("click", () => {
            document.querySelectorAll(".seat.selected").forEach(item => {
                item.classList.remove("selected");
            });

            seat.classList.add("selected");

            seatInfo.textContent =
                `${zone.name} Seat ${i} — ${zone.price} AZN`;
        });

        container.appendChild(seat);
    }
}

zones.forEach(createSeats);
