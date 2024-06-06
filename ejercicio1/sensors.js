class Sensor {
constructor(id, name, type, value, unit, updated_at) {
    this.id = id;
    this.name = name;
    this._type = type;
    this.value = value;
    this.unit = unit;
    this.updated_at = updated_at;
}



 

     
 set updateValue(newValue){
    if (this.isValidType(this._type)&& this.isValidType(newValue)){
        this.value = newValue;
        this.updated_at = new Date().toISOString();
        } else {
            console.error("invalido tipode sensor");
            console.log(" tipo de sensor no valido");
    };
}

    
 set isValidType(value){
    if(this._type==="temperature"){
        return typeof value==="number";

    } else if (this._type==="humidity"){
        return typeof value==="number" && value <=100;
    } else if (this._type==="pressure"){
        return typeof value==="number" && value >=0;
    }else{
        return false;
    }
}

}


class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

async loadSensors(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load sensors: ${response.status}`);
        }
        const data = await response.json();
        this.sensors = data.map(sensorData => new Sensor (
                sensorData.id,
                sensorData.name,
                sensorData.type,
                sensorData.value,
                sensorData.unit,
                sensorData.updated_at
            ));
            this.render();
    } catch (error) {
        console.error("Error al cargar el sensors:", error);
       
    }
}

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor._type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                        
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }

}



const monitor = new SensorManager();

monitor.loadSensors("sensors.json");
