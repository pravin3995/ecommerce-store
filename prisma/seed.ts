import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

type ProductSeed = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  stockQty: number;
  isFeatured?: boolean;
  specs: Record<string, string>;
};

const categories: CategorySeed[] = [
  {
    slug: "microcontrollers-dev-boards",
    name: "Microcontrollers & Dev Boards",
    description: "32-bit and 8-bit development boards for embedded projects, IoT and rapid prototyping.",
    sortOrder: 1,
  },
  {
    slug: "sensors-modules",
    name: "Sensors & Modules",
    description: "Environmental, motion, distance and identification sensors for measurement and automation.",
    sortOrder: 2,
  },
  {
    slug: "power-supplies",
    name: "Power Supplies & Converters",
    description: "Bench supplies, converters and battery charging modules to power every build safely.",
    sortOrder: 3,
  },
  {
    slug: "displays-leds",
    name: "Displays & LEDs",
    description: "OLED, LCD, TFT displays and addressable LEDs for readouts, UI and lighting effects.",
    sortOrder: 4,
  },
  {
    slug: "connectors-cables",
    name: "Connectors & Cables",
    description: "Headers, jumper wires, breakout cables and adapters to wire it all together.",
    sortOrder: 5,
  },
  {
    slug: "passive-components",
    name: "Passive Components",
    description: "Resistors, capacitors, inductors and potentiometers in assortments and packs.",
    sortOrder: 6,
  },
  {
    slug: "robotics-motors",
    name: "Robotics & Motors",
    description: "Gear motors, servos, steppers, drivers and chassis kits for robotics projects.",
    sortOrder: 7,
  },
  {
    slug: "tools-prototyping",
    name: "Tools & Prototyping",
    description: "Breadboards, meters, soldering kits and bench tools for building and debugging.",
    sortOrder: 8,
  },
];

const products: ProductSeed[] = [
  // Microcontrollers & Dev Boards
  {
    slug: "voltrix-uno-32-dev-board",
    sku: "VX-UNO32",
    name: "Voltrix UNO-32 Dev Board",
    brand: "Voltrix",
    categorySlug: "microcontrollers-dev-boards",
    shortDescription: "32-bit development board with familiar Uno-style pinout.",
    description:
      "A 32-bit development board built around a widely-supported open toolchain, with the same header layout as the classic Uno form factor so existing shields drop right on. Ideal for coursework, sensor prototyping and small automation projects.",
    priceCents: 1899,
    stockQty: 86,
    isFeatured: true,
    specs: {
      "Microcontroller": "32-bit ARM Cortex-M0+",
      "Clock Speed": "48 MHz",
      "Digital I/O": "20 pins",
      "Operating Voltage": "3.3V / 5V tolerant",
      "USB": "USB-C",
    },
  },
  {
    slug: "nordcore-feather-m4-board",
    sku: "NC-FM4",
    name: "NordCore Feather M4 Board",
    brand: "NordCore",
    categorySlug: "microcontrollers-dev-boards",
    shortDescription: "Compact high-performance board for battery-powered projects.",
    description:
      "A compact, high-clock-speed board with onboard LiPo charging, built for wearables and battery-powered sensor nodes that need real compute headroom in a small footprint.",
    priceCents: 2299,
    stockQty: 54,
    specs: {
      "Microcontroller": "32-bit ARM Cortex-M4",
      "Clock Speed": "120 MHz",
      "Battery Charging": "Onboard LiPo",
      "Form Factor": "Feather-compatible",
    },
  },
  {
    slug: "voltrix-pico-rp-dual-core-board",
    sku: "VX-PICORP",
    name: "Voltrix Pico-RP Dual-Core Board",
    brand: "Voltrix",
    categorySlug: "microcontrollers-dev-boards",
    shortDescription: "Dual-core microcontroller board with programmable I/O.",
    description:
      "A low-cost dual-core board with programmable I/O state machines for precise timing-critical tasks — bit-banged protocols, signal generation and more — alongside general-purpose GPIO for everyday projects.",
    priceCents: 599,
    stockQty: 210,
    isFeatured: true,
    specs: {
      "Microcontroller": "Dual-core 32-bit @ 133 MHz",
      "RAM": "264 KB",
      "GPIO": "26 pins",
      "Programmable I/O": "8 state machines",
    },
  },
  {
    slug: "ampereworks-iot-wifi-board",
    sku: "AW-IOTW1",
    name: "AmpereWorks IoT WiFi Board",
    brand: "AmpereWorks",
    categorySlug: "microcontrollers-dev-boards",
    shortDescription: "WiFi + Bluetooth board for connected sensor projects.",
    description:
      "An integrated WiFi and Bluetooth Low Energy board for connected sensor nodes, home automation and cloud-telemetry projects. Deep-sleep modes keep battery projects running for months.",
    priceCents: 799,
    stockQty: 128,
    specs: {
      "Wireless": "WiFi 802.11 b/g/n + BLE 5.0",
      "Microcontroller": "32-bit dual-core",
      "Flash": "4 MB",
      "Deep Sleep Current": "~10 µA",
    },
  },
  {
    slug: "ferrotek-nano-micro-board",
    sku: "FT-NANOM",
    name: "Ferrotek Nano Micro Board",
    brand: "Ferrotek",
    categorySlug: "microcontrollers-dev-boards",
    shortDescription: "Breadboard-friendly micro board for tight spaces.",
    description:
      "A breadboard-friendly micro board that fits into projects where every millimeter counts, without giving up a full set of analog and digital pins.",
    priceCents: 999,
    stockQty: 73,
    specs: {
      "Microcontroller": "8-bit AVR",
      "Clock Speed": "16 MHz",
      "Analog Inputs": "8",
      "Board Size": "45 x 18 mm",
    },
  },
  {
    slug: "voltrix-mega-2560-expansion-board",
    sku: "VX-MEGA2560",
    name: "Voltrix Mega-2560 Expansion Board",
    brand: "Voltrix",
    categorySlug: "microcontrollers-dev-boards",
    shortDescription: "High pin-count board for complex multi-sensor builds.",
    description:
      "A high pin-count board for projects that have outgrown a standard Uno-class layout — multi-axis CNC controllers, sensor arrays and large shield stacks.",
    priceCents: 2499,
    stockQty: 41,
    specs: {
      "Digital I/O": "54 pins",
      "Analog Inputs": "16",
      "Flash Memory": "256 KB",
      "UARTs": "4",
    },
  },

  // Sensors & Modules
  {
    slug: "voltrix-bme280-environmental-sensor",
    sku: "VX-BME280",
    name: "Voltrix Environmental Sensor Module",
    brand: "Voltrix",
    categorySlug: "sensors-modules",
    shortDescription: "Temperature, humidity and pressure in one module.",
    description:
      "A precision environmental sensor combining temperature, relative humidity and barometric pressure in a single I2C/SPI module — a staple for weather stations and indoor air-quality projects.",
    priceCents: 699,
    stockQty: 165,
    isFeatured: true,
    specs: {
      "Interface": "I2C / SPI",
      "Temperature Range": "-40°C to 85°C",
      "Humidity Accuracy": "±3% RH",
      "Pressure Range": "300–1100 hPa",
    },
  },
  {
    slug: "ampereworks-pir-motion-sensor",
    sku: "AW-PIR1",
    name: "AmpereWorks PIR Motion Sensor",
    brand: "AmpereWorks",
    categorySlug: "sensors-modules",
    shortDescription: "Passive infrared sensor for motion-triggered projects.",
    description:
      "A passive infrared motion sensor with adjustable sensitivity and delay trimmers — drop it into security lighting, occupancy counters or motion-triggered cameras.",
    priceCents: 349,
    stockQty: 190,
    specs: {
      "Detection Range": "up to 7 m",
      "Detection Angle": "120°",
      "Output": "Digital HIGH/LOW",
      "Operating Voltage": "5V–20V",
    },
  },
  {
    slug: "nordcore-ultrasonic-distance-sensor",
    sku: "NC-US100",
    name: "NordCore Ultrasonic Distance Sensor",
    brand: "NordCore",
    categorySlug: "sensors-modules",
    shortDescription: "Accurate non-contact distance measurement.",
    description:
      "A reliable ultrasonic ranging module for obstacle avoidance, liquid-level sensing and parking-assist style projects, with stable readings from 2cm to 4m.",
    priceCents: 399,
    stockQty: 142,
    specs: {
      "Range": "2 cm – 400 cm",
      "Accuracy": "±3 mm",
      "Interface": "Trigger/Echo digital",
      "Operating Voltage": "5V",
    },
  },
  {
    slug: "voltrix-mpu6050-imu-module",
    sku: "VX-MPU6050",
    name: "Voltrix 6-Axis IMU Module",
    brand: "Voltrix",
    categorySlug: "sensors-modules",
    shortDescription: "3-axis gyroscope and accelerometer on one chip.",
    description:
      "A 6-axis inertial measurement unit combining a 3-axis gyroscope and 3-axis accelerometer, ideal for self-balancing robots, drones and motion-tracking wearables.",
    priceCents: 449,
    stockQty: 118,
    specs: {
      "Axes": "3-axis gyro + 3-axis accel",
      "Interface": "I2C",
      "Gyro Range": "±250 to ±2000 °/s",
      "Accel Range": "±2g to ±16g",
    },
  },
  {
    slug: "ferrotek-soil-moisture-sensor",
    sku: "FT-SOIL1",
    name: "Ferrotek Soil Moisture Sensor",
    brand: "Ferrotek",
    categorySlug: "sensors-modules",
    shortDescription: "Capacitive sensor for automated watering projects.",
    description:
      "A corrosion-resistant capacitive soil moisture sensor for garden automation and greenhouse monitoring — outlasts the resistive probes that corrode within weeks.",
    priceCents: 549,
    stockQty: 97,
    specs: {
      "Sensing Type": "Capacitive",
      "Output": "Analog 0–3V",
      "Operating Voltage": "3.3V–5.5V",
      "Probe Material": "Corrosion-resistant coating",
    },
  },
  {
    slug: "voltrix-rfid-reader-module",
    sku: "VX-RFID1",
    name: "Voltrix RFID Reader Module",
    brand: "Voltrix",
    categorySlug: "sensors-modules",
    shortDescription: "13.56MHz RFID/NFC reader with card and fob included.",
    description:
      "A 13.56MHz RFID reader/writer module for access-control and inventory-tagging projects, bundled with a sample card and key fob to get started immediately.",
    priceCents: 649,
    stockQty: 88,
    specs: {
      "Frequency": "13.56 MHz",
      "Interface": "SPI",
      "Read Range": "up to 6 cm",
      "Included": "1x card, 1x key fob",
    },
  },

  // Power Supplies & Converters
  {
    slug: "voltrix-5v-3a-usb-c-bench-supply",
    sku: "VX-PSU53",
    name: "Voltrix 5V/3A USB-C Bench Supply",
    brand: "Voltrix",
    categorySlug: "power-supplies",
    shortDescription: "Regulated bench supply with USB-C PD input.",
    description:
      "A clean, regulated 5V/3A bench supply that takes any USB-C PD charger as input and outputs stable power through screw terminals and a barrel jack — no wall-wart hunting required.",
    priceCents: 1499,
    stockQty: 64,
    isFeatured: true,
    specs: {
      "Output": "5V / 3A max",
      "Input": "USB-C PD",
      "Ripple": "< 20 mV",
      "Outputs": "Screw terminal + barrel jack",
    },
  },
  {
    slug: "ampereworks-adjustable-buck-converter",
    sku: "AW-BUCK1",
    name: "AmpereWorks Adjustable Buck Converter",
    brand: "AmpereWorks",
    categorySlug: "power-supplies",
    shortDescription: "Step-down converter with onboard trim pot.",
    description:
      "A compact step-down converter module with an onboard trim potentiometer for dialing in exactly the voltage a downstream sensor or board needs.",
    priceCents: 299,
    stockQty: 176,
    specs: {
      "Input Range": "4V–40V",
      "Output Range": "1.2V–37V adjustable",
      "Max Current": "3A",
      "Efficiency": "up to 96%",
    },
  },
  {
    slug: "nordcore-18650-battery-charger-module",
    sku: "NC-CHG18650",
    name: "NordCore 18650 Battery Charger Module",
    brand: "NordCore",
    categorySlug: "power-supplies",
    shortDescription: "Single-cell lithium charger with protection circuit.",
    description:
      "A single-cell 18650 charging module with over-charge, over-discharge and short-circuit protection built in — a safe foundation for any battery-powered build.",
    priceCents: 199,
    stockQty: 240,
    specs: {
      "Cell Type": "18650 Li-ion",
      "Charge Current": "1A",
      "Protection": "OVP / OCP / short-circuit",
      "Input": "Micro-USB",
    },
  },
  {
    slug: "voltrix-solar-charge-controller",
    sku: "VX-SOLARCC",
    name: "Voltrix Solar Charge Controller",
    brand: "Voltrix",
    categorySlug: "power-supplies",
    shortDescription: "PWM solar controller for small off-grid setups.",
    description:
      "A PWM solar charge controller sized for small panels and battery banks — weather station power, remote sensor nodes and hobby off-grid projects.",
    priceCents: 1899,
    stockQty: 38,
    specs: {
      "Type": "PWM",
      "Max Panel Input": "20V / 10A",
      "Battery Support": "12V lead-acid / Li-ion",
      "Protection": "Reverse polarity, overcharge",
    },
  },
  {
    slug: "ferrotek-dc-dc-boost-converter",
    sku: "FT-BOOST1",
    name: "Ferrotek DC-DC Boost Converter",
    brand: "Ferrotek",
    categorySlug: "power-supplies",
    shortDescription: "Step-up converter for low-voltage battery projects.",
    description:
      "A step-up converter that turns a couple of AA batteries or a single Li-ion cell into a stable 5V or 9V rail for boards that need more than the battery alone provides.",
    priceCents: 249,
    stockQty: 155,
    specs: {
      "Input Range": "0.9V–5V",
      "Output": "5V or 9V selectable",
      "Max Current": "1.2A",
      "Efficiency": "up to 93%",
    },
  },

  // Displays & LEDs
  {
    slug: "voltrix-096-oled-display-module",
    sku: "VX-OLED096",
    name: "Voltrix 0.96\" OLED Display Module",
    brand: "Voltrix",
    categorySlug: "displays-leds",
    shortDescription: "Crisp monochrome OLED for compact readouts.",
    description:
      "A crisp 128x64 monochrome OLED that draws almost no power on dark backgrounds — perfect for battery-powered status displays and compact instrument panels.",
    priceCents: 599,
    stockQty: 134,
    isFeatured: true,
    specs: {
      "Resolution": "128 x 64",
      "Interface": "I2C",
      "Screen Size": "0.96 inch",
      "Viewing Angle": ">160°",
    },
  },
  {
    slug: "ampereworks-16x2-lcd-display",
    sku: "AW-LCD162",
    name: "AmpereWorks 16x2 LCD Display",
    brand: "AmpereWorks",
    categorySlug: "displays-leds",
    shortDescription: "Classic character LCD with backlight.",
    description:
      "The classic 16x2 character LCD with blue backlight — dead simple to drive and instantly readable, a reliable default for menus, sensor readouts and clocks.",
    priceCents: 449,
    stockQty: 168,
    specs: {
      "Characters": "16 columns x 2 rows",
      "Backlight": "Blue LED",
      "Interface": "Parallel (4/8-bit)",
      "Operating Voltage": "5V",
    },
  },
  {
    slug: "nordcore-ws2812b-led-strip-1m",
    sku: "NC-WS2812-1M",
    name: "NordCore Addressable LED Strip (1m)",
    brand: "NordCore",
    categorySlug: "displays-leds",
    shortDescription: "60 individually addressable RGB LEDs per meter.",
    description:
      "A one-meter strip of 60 individually addressable RGB LEDs, controllable over a single data line — build ambient lighting, VU meters or animated signage.",
    priceCents: 1299,
    stockQty: 92,
    specs: {
      "LED Count": "60 per meter",
      "Protocol": "Single-wire addressable",
      "Voltage": "5V",
      "Colors": "24-bit RGB",
    },
  },
  {
    slug: "voltrix-7-segment-display-module",
    sku: "VX-7SEG4",
    name: "Voltrix 7-Segment Display Module",
    brand: "Voltrix",
    categorySlug: "displays-leds",
    shortDescription: "4-digit display with onboard driver chip.",
    description:
      "A 4-digit 7-segment display with an onboard driver IC, so you control it over just two data pins instead of wrangling a dozen segment lines directly.",
    priceCents: 399,
    stockQty: 121,
    specs: {
      "Digits": "4",
      "Interface": "2-wire (CLK/DIO)",
      "Color": "Red",
      "Digit Height": "0.36 inch",
    },
  },
  {
    slug: "ferrotek-28-tft-touch-display",
    sku: "FT-TFT28",
    name: "Ferrotek 2.8\" TFT Touch Display",
    brand: "Ferrotek",
    categorySlug: "displays-leds",
    shortDescription: "Full-color resistive touchscreen with SD slot.",
    description:
      "A full-color resistive touchscreen with an onboard microSD slot for loading bitmaps and fonts — enough screen real estate for real UI, not just numbers.",
    priceCents: 1699,
    stockQty: 47,
    specs: {
      "Resolution": "320 x 240",
      "Touch Type": "Resistive",
      "Interface": "SPI",
      "Storage": "microSD slot",
    },
  },

  // Connectors & Cables
  {
    slug: "voltrix-jst-ph-connector-kit",
    sku: "VX-JSTKIT",
    name: "Voltrix JST-PH Connector Kit",
    brand: "Voltrix",
    categorySlug: "connectors-cables",
    shortDescription: "Assorted JST-PH plugs, sockets and crimp pins.",
    description:
      "An assortment of 2-, 3- and 4-pin JST-PH housings, sockets and crimp pins for building clean, polarized battery and sensor connections that won't pull loose.",
    priceCents: 999,
    stockQty: 112,
    specs: {
      "Pitch": "2.0 mm",
      "Pin Counts": "2, 3, 4-pin",
      "Includes": "Housings, crimp pins, sockets",
    },
  },
  {
    slug: "ampereworks-usb-c-breakout-cable",
    sku: "AW-USBCBO",
    name: "AmpereWorks USB-C Breakout Cable",
    brand: "AmpereWorks",
    categorySlug: "connectors-cables",
    shortDescription: "USB-C cable with exposed power/data test points.",
    description:
      "A USB-C cable with exposed power and data test points, so you can probe voltage, tap into data lines, or solder in a custom power path without hacking apart a good cable.",
    priceCents: 799,
    stockQty: 84,
    specs: {
      "Connector": "USB-C to USB-C",
      "Exposed Lines": "VBUS, GND, D+, D-",
      "Length": "1 m",
    },
  },
  {
    slug: "nordcore-dupont-jumper-wire-set",
    sku: "NC-DUPONT120",
    name: "NordCore Dupont Jumper Wire Set",
    brand: "NordCore",
    categorySlug: "connectors-cables",
    shortDescription: "120-piece male/female jumper wire set.",
    description:
      "120 jumper wires in male-to-male, male-to-female and female-to-female variants — the wires you'll reach for on literally every breadboard session.",
    priceCents: 599,
    stockQty: 220,
    isFeatured: true,
    specs: {
      "Count": "120 wires (40 each type)",
      "Length": "20 cm",
      "Types": "M-M, M-F, F-F",
    },
  },
  {
    slug: "voltrix-header-pin-assortment",
    sku: "VX-HEADERS",
    name: "Voltrix Header Pin Assortment",
    brand: "Voltrix",
    categorySlug: "connectors-cables",
    shortDescription: "Break-away straight and right-angle headers.",
    description:
      "Break-away 0.1\" pitch headers in straight and right-angle styles, male and female — snap off exactly the length you need for any board you're building.",
    priceCents: 499,
    stockQty: 190,
    specs: {
      "Pitch": "2.54 mm (0.1\")",
      "Styles": "Straight + right-angle",
      "Gender": "Male and female sets",
    },
  },
  {
    slug: "ferrotek-barrel-jack-adapter-pack",
    sku: "FT-BARREL5",
    name: "Ferrotek Barrel Jack Adapter Pack",
    brand: "Ferrotek",
    categorySlug: "connectors-cables",
    shortDescription: "5.5x2.1mm barrel jack to screw terminal adapters.",
    description:
      "Barrel jack to screw-terminal adapters so any 5.5x2.1mm wall adapter can power a bare board or breadboard project without splicing a single wire.",
    priceCents: 349,
    stockQty: 150,
    specs: {
      "Jack Size": "5.5 x 2.1 mm",
      "Pack Size": "5 pieces",
      "Termination": "Screw terminal",
    },
  },

  // Passive Components
  {
    slug: "voltrix-resistor-assortment-kit",
    sku: "VX-RES600",
    name: "Voltrix Resistor Assortment Kit",
    brand: "Voltrix",
    categorySlug: "passive-components",
    shortDescription: "600-piece resistor kit, 30 common values.",
    description:
      "600 resistors spanning 30 of the most commonly used values, sorted and labeled in a storage case — the resistor drawer every bench should have.",
    priceCents: 1099,
    stockQty: 132,
    isFeatured: true,
    specs: {
      "Piece Count": "600",
      "Values": "30 values, 1Ω–1MΩ",
      "Tolerance": "±1%",
      "Storage": "Labeled compartment case",
    },
  },
  {
    slug: "ampereworks-ceramic-capacitor-kit",
    sku: "AW-CERCAP",
    name: "AmpereWorks Ceramic Capacitor Kit",
    brand: "AmpereWorks",
    categorySlug: "passive-components",
    shortDescription: "Assorted ceramic capacitors, 24 values.",
    description:
      "An assortment of ceramic capacitors across 24 common values for decoupling, filtering and timing circuits, in a labeled storage case.",
    priceCents: 899,
    stockQty: 145,
    specs: {
      "Piece Count": "480",
      "Values": "24 values, 10pF–100µF",
      "Voltage Rating": "50V",
    },
  },
  {
    slug: "nordcore-electrolytic-capacitor-pack",
    sku: "NC-ELECAP",
    name: "NordCore Electrolytic Capacitor Pack",
    brand: "NordCore",
    categorySlug: "passive-components",
    shortDescription: "Radial electrolytic capacitors, common values.",
    description:
      "Radial electrolytic capacitors across the values you'll use most for power-supply smoothing and bulk decoupling on every board you build.",
    priceCents: 799,
    stockQty: 118,
    specs: {
      "Piece Count": "120",
      "Values": "12 values, 1µF–1000µF",
      "Voltage Rating": "25V–50V",
    },
  },
  {
    slug: "voltrix-inductor-assortment",
    sku: "VX-INDKIT",
    name: "Voltrix Inductor Assortment",
    brand: "Voltrix",
    categorySlug: "passive-components",
    shortDescription: "Radial inductors for filtering and converter builds.",
    description:
      "A set of radial inductors covering the common values needed for switching regulator and RF filtering projects, labeled and sorted by value.",
    priceCents: 999,
    stockQty: 76,
    specs: {
      "Piece Count": "100",
      "Values": "10 values, 1µH–1mH",
      "Package": "Radial leaded",
    },
  },
  {
    slug: "ferrotek-potentiometer-3-pack",
    sku: "FT-POT3",
    name: "Ferrotek Potentiometer 3-Pack",
    brand: "Ferrotek",
    categorySlug: "passive-components",
    shortDescription: "Panel-mount rotary potentiometers with knobs.",
    description:
      "Three panel-mount rotary potentiometers with matching knobs — volume controls, brightness dimmers or any analog input a project calls for.",
    priceCents: 599,
    stockQty: 160,
    specs: {
      "Values": "10kΩ",
      "Taper": "Linear",
      "Included": "3x pot + 3x knob",
    },
  },

  // Robotics & Motors
  {
    slug: "voltrix-n20-micro-gear-motor",
    sku: "VX-N20-100",
    name: "Voltrix N20 Micro Gear Motor",
    brand: "Voltrix",
    categorySlug: "robotics-motors",
    shortDescription: "Compact geared DC motor for small robots.",
    description:
      "A compact geared DC motor with a 100:1 gear ratio for high torque at low speed — the standard choice for small two-wheeled robot chassis.",
    priceCents: 349,
    stockQty: 180,
    isFeatured: true,
    specs: {
      "Gear Ratio": "100:1",
      "Voltage": "6V",
      "No-load Speed": "~150 RPM",
      "Shaft": "D-shaft",
    },
  },
  {
    slug: "ampereworks-sg90-servo-motor",
    sku: "AW-SG90",
    name: "AmpereWorks SG90 Servo Motor",
    brand: "AmpereWorks",
    categorySlug: "robotics-motors",
    shortDescription: "Micro servo for precise 180° positioning.",
    description:
      "A lightweight micro servo delivering reliable 180° positioning — pan-tilt camera mounts, robot arms and RC projects all lean on this workhorse.",
    priceCents: 449,
    stockQty: 210,
    specs: {
      "Rotation": "180°",
      "Torque": "1.8 kg·cm",
      "Voltage": "4.8V–6V",
      "Weight": "9 g",
    },
  },
  {
    slug: "nordcore-nema17-stepper-motor",
    sku: "NC-NEMA17",
    name: "NordCore NEMA17 Stepper Motor",
    brand: "NordCore",
    categorySlug: "robotics-motors",
    shortDescription: "Standard stepper for 3D printers and CNC builds.",
    description:
      "A standard NEMA17-frame stepper motor with the torque and step accuracy that 3D printer and small CNC builders rely on.",
    priceCents: 1299,
    stockQty: 62,
    specs: {
      "Frame Size": "NEMA17",
      "Step Angle": "1.8°",
      "Holding Torque": "40 N·cm",
      "Current": "1.5A/phase",
    },
  },
  {
    slug: "voltrix-dual-h-bridge-motor-driver",
    sku: "VX-HBRIDGE2",
    name: "Voltrix Dual H-Bridge Motor Driver",
    brand: "Voltrix",
    categorySlug: "robotics-motors",
    shortDescription: "Drive two DC motors forward, reverse and PWM speed.",
    description:
      "A dual H-bridge driver board that lets a microcontroller run two DC motors independently in both directions with PWM speed control — the bridge between logic-level pins and real motor current.",
    priceCents: 599,
    stockQty: 138,
    specs: {
      "Channels": "2",
      "Max Current": "2A per channel",
      "Logic Voltage": "3.3V/5V",
      "Motor Voltage": "up to 35V",
    },
  },
  {
    slug: "ferrotek-robot-chassis-kit",
    sku: "FT-CHASSIS2WD",
    name: "Ferrotek Robot Chassis Kit",
    brand: "Ferrotek",
    categorySlug: "robotics-motors",
    shortDescription: "2WD acrylic chassis with wheels and hardware.",
    description:
      "A laser-cut acrylic 2WD chassis with wheels, mounting hardware and a battery bay — the frame for your first (or fiftieth) rolling robot.",
    priceCents: 1499,
    stockQty: 55,
    specs: {
      "Drive": "2WD",
      "Material": "Acrylic",
      "Included": "Chassis, wheels, hardware, battery bay",
    },
  },

  // Tools & Prototyping
  {
    slug: "voltrix-830-point-breadboard",
    sku: "VX-BB830",
    name: "Voltrix 830-Point Breadboard",
    brand: "Voltrix",
    categorySlug: "tools-prototyping",
    shortDescription: "Full-size solderless breadboard.",
    description:
      "A full-size 830 tie-point solderless breadboard with reliable spring contacts and color-coded power rails — the foundation of every prototyping session.",
    priceCents: 599,
    stockQty: 260,
    isFeatured: true,
    specs: {
      "Tie Points": "830",
      "Power Rails": "4",
      "Size": "165 x 55 mm",
    },
  },
  {
    slug: "ampereworks-digital-multimeter",
    sku: "AW-DMM100",
    name: "AmpereWorks Digital Multimeter",
    brand: "AmpereWorks",
    categorySlug: "tools-prototyping",
    shortDescription: "Auto-ranging multimeter with continuity beeper.",
    description:
      "An auto-ranging digital multimeter covering voltage, current, resistance, continuity and diode test — the one tool that belongs on every bench, full stop.",
    priceCents: 2499,
    stockQty: 70,
    isFeatured: true,
    specs: {
      "Ranging": "Auto-ranging",
      "Functions": "V/A/Ω/continuity/diode",
      "Display": "6000-count LCD",
      "Includes": "Test leads, 9V battery",
    },
  },
  {
    slug: "nordcore-soldering-iron-kit",
    sku: "NC-SOLDER60",
    name: "NordCore Soldering Iron Kit",
    brand: "NordCore",
    categorySlug: "tools-prototyping",
    shortDescription: "Temperature-controlled iron with tip set and stand.",
    description:
      "A temperature-controlled soldering iron with a set of interchangeable tips, brass-wool cleaner and stand — everything needed to start soldering cleanly out of the box.",
    priceCents: 3499,
    stockQty: 48,
    specs: {
      "Power": "60W",
      "Temp Range": "200°C–450°C",
      "Includes": "5 tips, stand, cleaner",
    },
  },
  {
    slug: "voltrix-helping-hands-tool",
    sku: "VX-HELPHAND",
    name: "Voltrix Helping Hands Tool",
    brand: "Voltrix",
    categorySlug: "tools-prototyping",
    shortDescription: "Dual alligator-clip stand with magnifier.",
    description:
      "A weighted dual alligator-clip stand with a swing-arm magnifying glass — holds boards steady for soldering without a third hand.",
    priceCents: 1199,
    stockQty: 66,
    specs: {
      "Clips": "2 alligator clips",
      "Magnifier": "2.5x glass lens",
      "Base": "Weighted cast iron",
    },
  },
  {
    slug: "ferrotek-wire-stripper-cutter",
    sku: "FT-STRIP1",
    name: "Ferrotek Wire Stripper/Cutter",
    brand: "Ferrotek",
    categorySlug: "tools-prototyping",
    shortDescription: "Self-adjusting wire stripper for 10-24 AWG.",
    description:
      "A self-adjusting wire stripper and cutter covering 10-24 AWG, so you get a clean strip length every time without nicking the conductor.",
    priceCents: 1299,
    stockQty: 90,
    specs: {
      "Wire Range": "10–24 AWG",
      "Type": "Self-adjusting",
      "Extras": "Integrated cutter and crimper",
    },
  },
];

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: `/images/categories/${category.slug}.jpg`,
        sortOrder: category.sortOrder,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        imageUrl: `/images/categories/${category.slug}.jpg`,
        sortOrder: category.sortOrder,
      },
    });
    categoryIdBySlug.set(category.slug, created.id);
  }

  console.log("Seeding products...");
  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) throw new Error(`Unknown category slug: ${product.categorySlug}`);

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        categoryId,
        shortDescription: product.shortDescription,
        description: product.description,
        priceCents: product.priceCents,
        stockQty: product.stockQty,
        isFeatured: Boolean(product.isFeatured),
        images: JSON.stringify([`/images/products/${product.slug}.jpg`]),
        specs: JSON.stringify(product.specs),
      },
      create: {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        categoryId,
        shortDescription: product.shortDescription,
        description: product.description,
        priceCents: product.priceCents,
        stockQty: product.stockQty,
        isFeatured: Boolean(product.isFeatured),
        images: JSON.stringify([`/images/products/${product.slug}.jpg`]),
        specs: JSON.stringify(product.specs),
      },
    });
  }

  console.log("Seeding demo account...");
  const demoEmail = "demo@voltrix.test";
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    await prisma.user.create({
      data: {
        name: "Demo Shopper",
        email: demoEmail,
        passwordHash: await bcrypt.hash("voltrixdemo", 10),
      },
    });
  }

  console.log(`Done: ${categories.length} categories, ${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
