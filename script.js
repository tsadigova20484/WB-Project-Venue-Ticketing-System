document.addEventListener('DOMContentLoaded', () => {
    const seatsGroup = document.getElementById('seats-group');
    const zoomLayer = document.getElementById('zoom-layer');
    const tooltip = document.getElementById('tooltip');
    const selectedList = document.getElementById('selected-list');
    const totalAmount = document.getElementById('total-amount');
    const buyBtn = document.getElementById('buy-btn');

    // Zoom Düymələri
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    const SEAT_PRICE = 15;
    let selectedSeats = [];
    let currentScale = 1;

    // Şəkildəki amfiteatr konfiqurasiyası
    const rowConfigs = [
        { row: 1, count: 18, radius: 190, startAngle: -62, endAngle: 62 },
        { row: 2, count: 24, radius: 235, startAngle: -68, endAngle: 68 },
        { row: 3, count: 30, radius: 280, startAngle: -72, endAngle: 72 },
        { row: 4, count: 34, radius: 325, startAngle: -75, endAngle: 75 },
        { row: 5, count: 38, radius: 370, startAngle: -78, endAngle: 78 },
        { row: 6, count: 26, radius: 415, startAngle: -55, endAngle: 55 }
    ];

    const centerX = 400;
    const centerY = 450;

    // SVG Oturacaq Yaradılması
    function createSeatSVG(x, y, angle, row, seatNum) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "seat-icon");
        g.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);
        g.dataset.row = row;
        g.dataset.seat = seatNum;

        g.innerHTML = `
            <rect x="-9" y="-11" width="18" height="20" rx="3" />
            <path d="M-7,-9 L7,-9 C8,-9 8,-2 8,-2 L-8,-2 C-8,-2 -8,-9 -7,-9 Z" />
        `;

        if ((row === 2 && seatNum === 5) || (row === 4 && seatNum === 12)) {
            g.classList.add("occupied");
        }

        g.addEventListener("mouseenter", (e) => showTooltip(e, row, seatNum));
        g.addEventListener("mousemove", moveTooltip);
        g.addEventListener("mouseleave", hideTooltip);
        g.addEventListener("click", () => toggleSeatSelection(g, row, seatNum));

        return g;
    }

    function renderSeats() {
        rowConfigs.forEach(cfg => {
            const angleStep = (cfg.endAngle - cfg.startAngle) / (cfg.count - 1);

            for (let i = 0; i < cfg.count; i++) {
                const currentAngle = cfg.startAngle + (i * angleStep);
                const angleRad = (currentAngle - 90) * (Math.PI / 180);

                const x = centerX + cfg.radius * Math.cos(angleRad);
                const y = centerY + cfg.radius * Math.sin(angleRad);

                const seatElem = createSeatSVG(x, y, currentAngle, cfg.row, i + 1);
                seatsGroup.appendChild(seatElem);
            }
        });
    }

    // ZOOM FUNKSİYALARI
    function updateZoom() {
        zoomLayer.style.transform = `scale(${currentScale})`;
    }

    zoomInBtn.addEventListener('click', () => {
        if (currentScale < 2.2) {
            currentScale += 0.2;
            updateZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentScale > 0.7) {
            currentScale -= 0.2;
            updateZoom();
        }
    });

    zoomResetBtn.addEventListener('click', () => {
        currentScale = 1;
        updateZoom();
    });

    // Tooltip İdarəolunması
    function showTooltip(e, row, seat) {
        tooltip.style.display = 'block';
        tooltip.innerHTML = `Sıra ${row}, Yer ${seat} - <strong>${SEAT_PRICE} AZN</strong>`;
        moveTooltip(e);
    }

    function moveTooltip(e) {
        const venueCard = document.querySelector('.venue-card').getBoundingClientRect();
        tooltip.style.left = `${e.clientX - venueCard.left + 10}px`;
        tooltip.style.top = `${e.clientY - venueCard.top - 35}px`;
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    // Yer Seçimi Və Inspector-un Yenilənməsi
    function toggleSeatSelection(seatElem, row, seat) {
        if (seatElem.classList.contains("occupied")) return;

        const seatId = `Sır ${row}, Yer ${seat}`;

        if (seatElem.classList.contains("selected")) {
            seatElem.classList.remove("selected");
            selectedSeats = selectedSeats.filter(item => item.id !== seatId);
        } else {
            seatElem.classList.add("selected");
            selectedSeats.push({ id: seatId, price: SEAT_PRICE });
        }

        updateInspector();
    }

    function updateInspector() {
        selectedList.innerHTML = '';

        if (selectedSeats.length === 0) {
            selectedList.innerHTML = '<span class="empty-msg">Hələ heç bir yer seçilməyib</span>';
            buyBtn.disabled = true;
            totalAmount.textContent = '0';
            return;
        }
        

        let total = 0;
        selectedSeats.forEach(seat => {
            total += seat.price;
            const tag = document.createElement('span');
            tag.className = 'seat-tag';
            tag.textContent = seat.id;
            selectedList.appendChild(tag);
        });

        totalAmount.textContent = total;
        buyBtn.disabled = false;
    }

    buyBtn.addEventListener('click', () => {
        alert(`Təbrik edirik! ${selectedSeats.length} bilet uğurla alındı.\nCəmi: ${totalAmount.textContent} AZN`);
    });

    renderSeats();
});