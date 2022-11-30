

let theCanvas = document.getElementById("theCanvas");
let theContext = theCanvas.getContext("2d");
let trailCanvas = document.getElementById("trailCanvas");
let trailContext = trailCanvas.getContext("2d");
let ip_initial_u = document.getElementById("ip_initial_u");
let ip_initial_h = document.getElementById("ip_initial_h");
let animation_speed = document.getElementById("animation_speed");
let h0, u, v, h, t;
let h_max;
let m = 1;
let h_min = 0;
let TE_min = 0;
let v_max;
let t_max;
let v_min;
let g = -10;
let t_current = 0;
let t_bounce = 0;
        let h_current;
        let v_current;
        let PE_current;
        let KE_current;
        let TE_current;
        let TE_max;
        let timer;
        let ball_radius = 20;
        let padding = 10;

        let animation_current_status = document.getElementById("animation_current_status");
        let solution_header = document.getElementById("solution_header");
        let display_calculated_values = document.getElementById("display_calculated_values");

        let checkbox1 = document.getElementById("checkbox1");

        let checkbox_right = document.getElementById("checkbox_right");
        let checkbox_upwards = document.getElementById("checkbox_upwards");

        let display_energy_loss = document.getElementById("display_energy_loss");
        let ip_energy_loss = document.getElementById("ip_energy_loss");



        let device_size = document.getElementById("device_size");

        let xPadding = 60;
        let yPadding = 30;
        let x_offset = 30;
        let y_offset = 20;
        let t_previous;
        let h_previous;
        let v_previous;
        let TE_previous;
        let PE_previous;
        let KE_previous;
        let multiple_t_max = 4;
        let displacement_graph = document.getElementById("displacement_graph");
        let displacementContext = displacement_graph.getContext('2d');
        let velocity_graph = document.getElementById("velocity_graph");
        let velocityContext = velocity_graph.getContext('2d');
        let energy_graph = document.getElementById("energy_graph");
        let energyContext = energy_graph.getContext('2d');

        let displacementAxisContext = displacement_graph.getContext('2d');

        let velocityAxisContext = velocity_graph.getContext('2d');

        let energyAxisContext = energy_graph.getContext('2d');
        let energy_graph_key = document.getElementById("energy_graph_key");
        let energy_key_Context = energy_graph_key.getContext('2d');

        let previous_cycle;
        let current_cycle;

		checkbox1.checked = true;
		checkbox_right.checked = false;

		checkbox_upwards.checked = true;
		resizeCanvas();
		resetAll();
		display_calculated_values.style.display="none";

		device_size.innerHTML="Device width: " + window.innerWidth + ", height: " + window.innerHeight;

		initializeEnergyGraphKey();


		function show_energy_loss(){
			display_energy_loss.innerHTML = ip_energy_loss.value + "%"
		}

		function toggleRight(){
			if (checkbox_right.checked==true){
				checkbox_upwards.checked=false;

				theCanvas.height=120;
				trailCanvas.height=120;
				if (window.innerWidth<550){
					theCanvas.width=0.98*window.innerWidth;
					trailCanvas.width=0.98*window.innerWidth;
				}
				else {
					theCanvas.width=550;
					trailCanvas.width=550;
				}

			}

			if (checkbox_right.checked==false){
				checkbox_upwards.checked=true;
				theCanvas.width=250;
				trailCanvas.width=250;
				theCanvas.height=300;
				trailCanvas.height=300;

			}

		}

		function toggleUpwards(){
			if (checkbox_upwards.checked==true){
				checkbox_right.checked=false;
				theCanvas.width=250;
				trailCanvas.width=250;
				theCanvas.height=300;
				trailCanvas.height=300;


			}
			if (checkbox_upwards.checked==false){
				checkbox_right.checked=true;
				theCanvas.height=120;
				trailCanvas.height=120;
				if (window.innerWidth<550){
					theCanvas.width=0.98*window.innerWidth;
					trailCanvas.width=0.98*window.innerWidth;
				}
				else {
					theCanvas.width=550;
					trailCanvas.width=550;
				}

			}

		}


		function resizeCanvas(){
			if (window.innerWidth<550){
				theCanvas.width=0.98*window.innerWidth;
				trailCanvas.width=0.98*window.innerWidth;
				theCanvas.height=300;
				trailCanvas.height=300;
			}
			else {
				theCanvas.width=550;
				trailCanvas.width=550;
				theCanvas.height=300;
				trailCanvas.height=300;
			}
		}



		function clearAll() {
			window.clearTimeout(timer);
			document.getElementById("pause_resume_button").value="Pause";
			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			t_bounce = 0;
			t_current = 0;
			drawObjectBottom();

			animation_current_status.innerHTML="Высота h: 0m<br/>Время t: 0s";
			initializeDisplacementGraph();
			initializeVelocityGraph();
			initializeEnergyGraph();


		}

		function clearAllValues(){
			ip_initial_u.value="";
			ip_initial_h.value="";

		}

		function resetAll(){
			clearAll();
			clearAllValues();
		}




		function arrow(ctx, x1, y1, x2, y2, start, end) {
			  let rot = -Math.atan2(x1 - x2, y1 - y2);
			  ctx.beginPath();
			  ctx.moveTo(x1, y1);
			  ctx.lineTo(x2, y2);
			  ctx.stroke();
			  if (start) {
				arrowHead(ctx, x1, y1, rot);
			  }
			  if (end) {
				arrowHead(ctx, x2, y2, rot + Math.PI);
			  }
		}

		function arrowHead(ctx, x, y, rot) {
			  ctx.save();
			  ctx.translate(x, y);
			  ctx.rotate(rot);
			  ctx.beginPath();
			  ctx.moveTo(0, 0);
			  ctx.lineTo(-3, -8);
			  ctx.lineTo(3, -8);
			  ctx.closePath();
			  ctx.fill();
			  ctx.restore();
		}






        function getXPixel(val) {
            return (val/(multiple_t_max*t_max) *(displacement_graph.width - xPadding - x_offset) + xPadding);
        }
        function getYPixel_displacement(val) {
            return (displacement_graph.height - yPadding - (((val-h_min)/(h_max-h_min))*(displacement_graph.height - yPadding - y_offset)));
        }


		function drawAxisDisplacement() {
			displacementAxisContext.lineWidth = 2;
			displacementAxisContext.strokeStyle = '#333';
			displacementAxisContext.font = 'bold 10pt sans-serif';
			displacementAxisContext.textAlign = "center";
			displacementAxisContext.textBaseline = "top";

			displacementAxisContext.fillText("График высота-время", (displacement_graph.width-xPadding)/2+xPadding, 0);

			displacementAxisContext.textAlign = "left";
            arrow(displacementAxisContext, xPadding, displacement_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			displacementAxisContext.fillText("h", xPadding+6, 0);

			displacementAxisContext.textAlign = "right";
			displacementAxisContext.textBaseline = "bottom";

			if (h_max==undefined){
				arrow(displacementAxisContext, xPadding-5, displacement_graph.height - yPadding, displacement_graph.width, displacement_graph.height - yPadding, false, true );
				displacementAxisContext.fillText("t", displacement_graph.width, displacement_graph.height - yPadding - 5);
			}

			else if (h_max!=undefined){
				arrow(displacementAxisContext, xPadding-5, getYPixel_displacement(0), displacement_graph.width, getYPixel_displacement(0), false, true);
				displacementAxisContext.fillText("t", displacement_graph.width, getYPixel_displacement(0) - 5);
			}
			displacementAxisContext.stroke();
		}

		function labelAxisDisplacement() {
				displacementAxisContext.font = 'italic 8pt sans-serif';
				displacementAxisContext.textAlign = "right";
                displacementAxisContext.textBaseline = "top";


				displacementAxisContext.font = 'italic 8pt sans-serif';
				displacementAxisContext.textAlign = "center";
                displacementAxisContext.textBaseline = "alphabetic";

                for(let i = 0; i < 4; i ++) {

                    displacementAxisContext.fillText(((multiple_t_max*t_max/3*i+current_cycle*multiple_t_max*t_max)).toPrecision(3), getXPixel(multiple_t_max*t_max/3*i), getYPixel_displacement(0) + 20);
					// mark out the axis
					displacementAxisContext.strokeStyle = '#000';
					displacementAxisContext.beginPath();
					displacementAxisContext.moveTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_displacement(0) - 5 );
					displacementAxisContext.lineTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_displacement(0) + 5);
				   	displacementAxisContext.stroke();
                }

				displacementAxisContext.textAlign = "right";
                displacementAxisContext.textBaseline = "middle";

                for(let i = 0; i < 4; i ++) {
                    displacementAxisContext.fillText((h_max/3*i).toPrecision(3), xPadding - 10, getYPixel_displacement((h_max/3*i)));
					displacementAxisContext.strokeStyle = '#000';
					displacementAxisContext.beginPath();
					displacementAxisContext.moveTo(xPadding - 5, getYPixel_displacement((h_max/3*i)));
					displacementAxisContext.lineTo(xPadding + 5, getYPixel_displacement((h_max/3*i)));
				   	displacementAxisContext.stroke();
                }
		}


		function initializeDisplacementGraph() {
			displacementAxisContext.clearRect(0, 0, displacement_graph.width, displacement_graph.height);
			drawAxisDisplacement();
			labelAxisDisplacement();
			t_previous = 0;
			h_previous = h0;
		}

		function drawDisplacementGraph() {



                displacementContext.strokeStyle = '#f00';

                displacementContext.beginPath();


                current_cycle = Math.floor((getXPixel(t_previous) - xPadding) / (displacement_graph.width - xPadding - x_offset));


                if (getXPixel(t_current) <= getXPixel(t_max)){
	                displacementContext.moveTo(getXPixel(t_previous), getYPixel_displacement(h_previous));

	                displacementContext.lineTo(getXPixel(t_current), getYPixel_displacement(h_current));
               	}



               	else {

               		if (current_cycle > previous_cycle) {
               			displacementContext.clearRect(0, 0, displacement_graph.width, displacement_graph.height);
               			drawAxisDisplacement();
               			labelAxisDisplacement();

               		}
 					if(Math.abs((getXPixel(t_previous) - xPadding) % (displacement_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (displacement_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			displacementContext.moveTo((getXPixel(t_previous) - xPadding) % (displacement_graph.width - xPadding - x_offset ) + xPadding, getYPixel_displacement(h_previous));

	                	displacementContext.lineTo((getXPixel(t_current) - xPadding) % (displacement_graph.width - xPadding - x_offset ) + xPadding , getYPixel_displacement(h_current));
	                }
               	}

                displacementContext.stroke();


				h_previous = h_current;


        }



	//###############VELOCITY GRAPH



        function getYPixel_velocity(val) {
            return (velocity_graph.height - yPadding - (((val+v_max)/(2*v_max))*(velocity_graph.height - yPadding - y_offset)));
        }


		function drawAxisVelocity() {
			velocityAxisContext.lineWidth = 2;
			velocityAxisContext.strokeStyle = '#333';
			velocityAxisContext.font = 'bold 10pt sans-serif';
			velocityAxisContext.textAlign = "center";
			velocityAxisContext.textBaseline = "top";

			velocityAxisContext.fillText("График скорость-время", (velocity_graph.width-xPadding)/2+xPadding, 0);

			velocityAxisContext.textAlign = "left";

			arrow(velocityAxisContext, xPadding, velocity_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			velocityAxisContext.fillText("v", xPadding+6, 0);

			velocityAxisContext.textAlign = "right";
			velocityAxisContext.textBaseline = "bottom";

			if (v_max==undefined){
				arrow(velocityAxisContext, xPadding-5, velocity_graph.height - yPadding, velocity_graph.width, velocity_graph.height - yPadding, false, true );
				velocityAxisContext.fillText("t", velocity_graph.width, velocity_graph.height - yPadding - 5);
			}

			else if (v_max!=undefined){
				arrow(velocityAxisContext, xPadding-5, getYPixel_velocity(0), velocity_graph.width, getYPixel_velocity(0), false, true);
				velocityAxisContext.fillText("t", velocity_graph.width, getYPixel_velocity(0) - 5);
			}
			velocityAxisContext.stroke();
		}

		function labelAxisVelocity() {
				velocityAxisContext.font = 'italic 8pt sans-serif';
				velocityAxisContext.textAlign = "right";
                velocityAxisContext.textBaseline = "top";

				velocityAxisContext.font = 'italic 8pt sans-serif';
				velocityAxisContext.textAlign = "center";
                velocityAxisContext.textBaseline = "alphabetic";

				if (t_max!=undefined){
					for(var i = 0; i < 4; i ++) {

						velocityAxisContext.fillText(((multiple_t_max*t_max/3*i)+current_cycle*multiple_t_max*t_max).toPrecision(3), getXPixel(multiple_t_max*t_max/3*i), getYPixel_velocity(0) + 20);
						velocityAxisContext.strokeStyle = '#000';
						velocityAxisContext.beginPath();
						velocityAxisContext.moveTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_velocity(0) - 5 );
						velocityAxisContext.lineTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_velocity(0) + 5);
						velocityAxisContext.stroke();
					}
				}

				velocityAxisContext.textAlign = "right";
                velocityAxisContext.textBaseline = "middle";

                	velocityAxisContext.fillText((0).toPrecision(3), xPadding - 10, getYPixel_velocity(0));
					// mark out the axis
					velocityAxisContext.strokeStyle = '#000';
					velocityAxisContext.beginPath();
					velocityAxisContext.moveTo(xPadding - 5, getYPixel_velocity((2*v_max/3*i-v_max)));
					velocityAxisContext.lineTo(xPadding + 5, getYPixel_velocity((2*v_max/3*i-v_max)));
				   	velocityAxisContext.stroke();

                for(var i = 0; i < 4; i ++) {
                    velocityAxisContext.fillText((2*v_max/3*i-v_max).toPrecision(3), xPadding - 10, getYPixel_velocity((2*v_max/3*i-v_max)));
					velocityAxisContext.strokeStyle = '#000';
					velocityAxisContext.beginPath();
					velocityAxisContext.moveTo(xPadding - 5, getYPixel_velocity((2*v_max/3*i-v_max)));
					velocityAxisContext.lineTo(xPadding + 5, getYPixel_velocity((2*v_max/3*i-v_max)));
				   	velocityAxisContext.stroke();
                }
		}


		function initializeVelocityGraph() {

			velocityAxisContext.clearRect(0, 0, velocity_graph.width, velocity_graph.height);
			drawAxisVelocity();
			labelAxisVelocity();
			t_previous = 0;
			v_previous = u;
		}

		function drawVelocityGraph() {



	        velocityContext.strokeStyle = '#f00';
            velocityContext.beginPath();
	        if (getXPixel(t_current) <= getXPixel(t_max)){
	                velocityContext.moveTo(getXPixel(t_previous), getYPixel_velocity(v_previous));

	                velocityContext.lineTo(getXPixel(t_current), getYPixel_velocity(v_current));
               	}



               	else {

               		if (current_cycle > previous_cycle) {
               			velocityContext.clearRect(0, 0, velocity_graph.width, velocity_graph.height);
               			drawAxisVelocity();
               			labelAxisVelocity();

               		}
 					if(Math.abs((getXPixel(t_previous) - xPadding) % (velocity_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (velocity_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			velocityContext.moveTo((getXPixel(t_previous) - xPadding ) % (velocity_graph.width - xPadding - x_offset) + xPadding, getYPixel_velocity(v_previous));

	                	velocityContext.lineTo((getXPixel(t_current) - xPadding) % (velocity_graph.width - xPadding - x_offset) + xPadding , getYPixel_velocity(v_current));
	                }
               	}

	        velocityContext.stroke();

			v_previous = v_current;


        }


	//###############ENERGY GRAPH

		function initializeEnergyGraphKey(){

			energy_key_Context.font = '9pt sans-serif';
			energy_key_Context.textAlign = "left";
			energy_key_Context.textBaseline = "middle";

			energy_key_Context.lineWidth = 2;

			energy_key_Context.strokeStyle = 'grey';
			arrow(energy_key_Context, xPadding, 10, xPadding+30, 10,  false, false);
			energy_key_Context.fillText("Полная энергия", xPadding+30+10, 10);

			energy_key_Context.setLineDash([2, 2]);
			energy_key_Context.strokeStyle = 'red';
			arrow(energy_key_Context, xPadding, 20, xPadding+30, 20,  false, false);
			energy_key_Context.fillText("Потенциальная энергия", xPadding+30+10, 20);

			energy_key_Context.setLineDash([2, 0]);
			energy_key_Context.strokeStyle = 'blue';
			arrow(energy_key_Context, xPadding, 30, xPadding+30, 30,  false, false);
			energy_key_Context.fillText("Кинетическая энергия", xPadding+30+10, 30);


		}

        function getYPixel_energy(val) {
            return (energy_graph.height - yPadding - (((val-TE_min)/(TE_max-TE_min))*(energy_graph.height - yPadding - y_offset)));
        }


		function drawAxisEnergy() {
			energyAxisContext.lineWidth = 2;
			energyAxisContext.strokeStyle = '#333';
			energyAxisContext.font = 'bold 10pt sans-serif';
			energyAxisContext.textAlign = "center";
			energyAxisContext.textBaseline = "top";

			energyAxisContext.fillText("График энергия-время", (energy_graph.width-xPadding)/2+xPadding, 0);

			energyAxisContext.textAlign = "left";

			arrow(energyAxisContext, xPadding, energy_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			energyAxisContext.font = 'bold 8pt sans-serif';
			energyAxisContext.fillText("energy", xPadding+6, 0);

			energyAxisContext.textAlign = "right";
			energyAxisContext.textBaseline = "bottom";
			energyAxisContext.font = 'bold 10pt sans-serif';
			if (TE_max==undefined){
				arrow(energyAxisContext, xPadding-5, energy_graph.height - yPadding, energy_graph.width, energy_graph.height - yPadding, false, true );
				energyAxisContext.fillText("t", energy_graph.width, energy_graph.height - yPadding - 5);
			}

			else if (TE_max!=undefined){
				arrow(energyAxisContext, xPadding-5, getYPixel_energy(0), energy_graph.width, getYPixel_energy(0), false, true);
				energyAxisContext.fillText("t", energy_graph.width, getYPixel_energy(0) - 5);
			}
			energyAxisContext.stroke();
		}

		function labelAxisEnergy() {
				energyAxisContext.font = 'italic 8pt sans-serif';
				energyAxisContext.textAlign = "right";
                energyAxisContext.textBaseline = "top";


				energyAxisContext.font = 'italic 8pt sans-serif';
				energyAxisContext.textAlign = "center";
                energyAxisContext.textBaseline = "alphabetic";

                for(var i = 0; i < 4; i ++) {

                    energyAxisContext.fillText(((multiple_t_max*t_max/3*i)+current_cycle*multiple_t_max*t_max).toPrecision(3), getXPixel(multiple_t_max*t_max/3*i), getYPixel_energy(0) + 20);
					energyAxisContext.strokeStyle = '#000';
					energyAxisContext.beginPath();
					energyAxisContext.moveTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_energy(0) - 5 );
					energyAxisContext.lineTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_energy(0) + 5);
				   	energyAxisContext.stroke();
                }

              	energyAxisContext.textAlign = "right";
                energyAxisContext.textBaseline = "middle";

                for(var i = 0; i < 4; i ++) {
                    energyAxisContext.fillText((TE_max/3*i).toPrecision(3), xPadding - 10, getYPixel_energy((TE_max/3*i)));
					energyAxisContext.strokeStyle = '#000';
					energyAxisContext.beginPath();
					energyAxisContext.moveTo(xPadding - 5, getYPixel_energy((TE_max/3*i)));
					energyAxisContext.lineTo(xPadding + 5, getYPixel_energy((TE_max/3*i)));
				   	energyAxisContext.stroke();
                }
		}


		function initializeEnergyGraph() {
			energyAxisContext.clearRect(0, 0, energy_graph.width, energy_graph.height);
			drawAxisEnergy();
			labelAxisEnergy();
			t_previous = 0;
			h_previous = h0;
		}

		function drawEnergyGraph() {


                //###############total energy
                energyContext.strokeStyle = 'grey';

                energyContext.beginPath();
                 if (getXPixel(t_current) <= getXPixel(t_max)){
	                energyContext.moveTo(getXPixel(t_previous), getYPixel_energy(TE_previous));

	                energyContext.lineTo(getXPixel(t_current), getYPixel_energy(TE_current));
               	}



               	else {

               		if (current_cycle > previous_cycle) {
               			energyContext.clearRect(0, 0, energy_graph.width, energy_graph.height);
               			previous_cycle = current_cycle;
               			drawAxisEnergy();
               			labelAxisEnergy();

               		}
 					if(Math.abs((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding- x_offset ) + xPadding) < 100 ){
               			energyContext.moveTo((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding- x_offset ) + xPadding, getYPixel_energy(TE_previous));

	                	energyContext.lineTo((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding , getYPixel_energy(TE_current));
	                }
               	}

                energyContext.stroke();


				TE_previous = TE_current;


				 //###############potential energy
				energyContext.setLineDash([2, 2]);
				energyContext.strokeStyle = 'red';

                energyContext.beginPath();
                                 if (getXPixel(t_current) <= getXPixel(t_max)){
	                energyContext.moveTo(getXPixel(t_previous), getYPixel_energy(PE_previous));

	                energyContext.lineTo(getXPixel(t_current), getYPixel_energy(PE_current));
               	}



               	else {


 					if(Math.abs((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			energyContext.moveTo((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding, getYPixel_energy(PE_previous));

	                	energyContext.lineTo((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding , getYPixel_energy(PE_current));
	                }
               	}
                energyContext.stroke();


				PE_previous = PE_current;


				//###############kinetic energy
				energyContext.setLineDash([2, 0]);
				energyContext.strokeStyle = 'blue';

                energyContext.beginPath();
                                 if (getXPixel(t_current) <= getXPixel(t_max)){
	                energyContext.moveTo(getXPixel(t_previous), getYPixel_energy(KE_previous));

	                energyContext.lineTo(getXPixel(t_current), getYPixel_energy(KE_current));
               	}



               	else {


 					if(Math.abs((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			energyContext.moveTo((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding, getYPixel_energy(KE_previous));

	                	energyContext.lineTo((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding , getYPixel_energy(KE_current));
	                }
               	}

                energyContext.stroke();

				t_previous = t_current;

				KE_previous = KE_current;


        }


	document.addEventListener("keydown", function (e) { // calculate when enter is pressed
		if (e.keyCode === 13) {
			calculateAll();
		}
	});
        function calculateAll() {
        	previous_cycle = 0;
        	current_cycle = 0;
			clearAll();
            window.clearTimeout(timer);
			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			drawObjectBottom();



			if (!(ip_initial_u.value!="" && ip_initial_h.value!="")) {
				alert("Введите оба значения.");
			}
			else if (ip_initial_u.value!="" && ip_initial_h.value!="") {
				if (ip_initial_h.value <0){
					alert("Высота должна быть больше нуля.");
				}
				else {
					u = Number(ip_initial_u.value);
					h0 = Number(ip_initial_h.value);
					h_max = u*u/(2*(-1*g)) + h0;
					h_min = 0;
					h_previous = h0;
					v_max = Math.sqrt(u*u + -2*g*h0);

					t_max = 3*h_max/v_max;


					TE_max = m*(-g)*h_max;
					PE_previous = m*(-g)*h0;
					KE_previous = 0.5 * m * u * u;
					TE_previous = PE_previous + KE_previous;

					solution_header.innerHTML = t_max + "," + v_max;
					drawHeights();
					initializeDisplacementGraph();
					initializeVelocityGraph();
					initializeEnergyGraph();
					moveObject();
				}
			}


        }


        function moveObject() {


			h_current = h0 + u*t_bounce + 0.5*g*t_bounce*t_bounce;
			v_current = u + g*t_bounce;
			var current_v_max = Math.sqrt(u*u + -2*g*h0);

			var dt = t_max/50;
			t_current += dt;
			t_bounce += dt;


            if (h_current < 0) {

            	v_current = -current_v_max;
                u = current_v_max*(Math.sqrt(Number(100-ip_energy_loss.value)/100));
				h0 = 0;
				h_current = 0;
				t_bounce = 0;
            }

            PE_current = m*(-g)*h_current;
			KE_current = 0.5 * m * v_current * v_current;
			TE_current = PE_current + KE_current;

			drawObject();
			drawDisplacementGraph();
			drawVelocityGraph();
			drawEnergyGraph();
			timer = window.setTimeout(moveObject, 1000/Number(animation_speed.value));
        }

		function pause_resume_animation() {
			var button_value = document.getElementById("pause_resume_button").value;
			if (button_value=="Pause"){
				window.clearTimeout(timer);
				document.getElementById("pause_resume_button").value="Resume";
			}

			if (button_value=="Resume"){
				moveObject();
				document.getElementById("pause_resume_button").value="Pause";
			}

		}

		function pause_animation() {
			window.clearTimeout(timer);
		}

		function resume_animation() {
			moveObject();
		}


        function drawObject() {
			if (checkbox_right.checked==true){
				animation_current_status.innerHTML="Смещение s: " + h_current + "m<br/>Время t: " + t_current + "s";
				theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
				var pixelX = h_current/h_max*theCanvas.width*0.8;
				var pixelY = theCanvas.height/2;
				theContext.beginPath();
				theContext.arc(pixelX, pixelY, ball_radius, 0, 2*Math.PI);
				var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, ball_radius);
				theGradient.addColorStop(0, "#ffd0d0");
				theGradient.addColorStop(1, "#9640ff");
				theContext.fillStyle = theGradient;
				theContext.fill();
			}

			else if (checkbox_upwards.checked==true){
				animation_current_status.innerHTML="Смещение s: " + h_current.toPrecision(5) + "m<br/>Время t: " + t_current.toPrecision(5) + "s";
				theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
				var pixelY = theCanvas.height-(h_current/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius);
				var pixelX = theCanvas.width/2;
				theContext.beginPath();
				theContext.arc(pixelX, pixelY, ball_radius, 0, 2*Math.PI);
				var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, ball_radius);
				theGradient.addColorStop(0, "#ffd0d0");
				theGradient.addColorStop(1, "#9640ff");
				theContext.fillStyle = theGradient;
				theContext.fill();
			}


        }

        function drawObjectBottom() {
            theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);

            var pixelX = theCanvas.width/2;
            var pixelY = theCanvas.height/2;

			theContext.beginPath();
			var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, ball_radius); // make ball 'shiny' with gradient
            theGradient.addColorStop(0, "#ffd0d0");
            theGradient.addColorStop(1, "#9640ff");
            theContext.fillStyle = theGradient;
            theContext.fill();

			trailContext.font = "12px Arial";
			trailContext.textAlign="center";

			if (checkbox_right.checked==true){
				trailContext.textAlign="top";
				trailContext.textBaseline="middle";
				trailContext.fillText("s=0m",trailCanvas.width/2,trailCanvas.height-8);
                trailContext.setLineDash([5, 0]);
				trailContext.beginPath();
				trailContext.moveTo(theCanvas.width/2, theCanvas.height*0.2);
				trailContext.lineTo(theCanvas.width/2, theCanvas.height*0.8);
				trailContext.stroke();
			}
			else if (checkbox_upwards.checked==true){
				trailContext.textAlign="left";
				trailContext.textBaseline="middle";
				trailContext.fillText("h=0m",trailCanvas.width*0.65+padding,trailCanvas.height-padding);

				//draw line at center to indicate object starting position
				trailContext.setLineDash([5, 0]);
				trailContext.beginPath();
				trailContext.moveTo(theCanvas.width*0.35, trailCanvas.height-padding);
				trailContext.lineTo(theCanvas.width*0.65, trailCanvas.height-padding);
				trailContext.stroke();
			}
		}

		function drawHeights() {
            theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);


			trailContext.font = "12px Arial";
			trailContext.textAlign="center";

			if (checkbox_right.checked==true){
				trailContext.textAlign="top";
				trailContext.textBaseline="middle";
				trailContext.fillText("s=0m",trailCanvas.width/2,trailCanvas.height-8);

				trailContext.setLineDash([5, 0]);
				trailContext.beginPath();
				trailContext.moveTo(theCanvas.width/2, theCanvas.height*0.2);
				trailContext.lineTo(theCanvas.width/2, theCanvas.height*0.8);
				trailContext.stroke();
			}
			else if (checkbox_upwards.checked==true){

					trailContext.textAlign="left";
					trailContext.textBaseline="middle";
					trailContext.fillText("max height="+h_max+"m",trailCanvas.width*0.65+padding,padding+2*ball_radius);

					trailContext.setLineDash([2, 3]);
					trailContext.beginPath();
					trailContext.moveTo(theCanvas.width*0.35, padding+2*ball_radius);
					trailContext.lineTo(theCanvas.width*0.65, padding+2*ball_radius);
					trailContext.stroke();


					trailContext.textAlign="right";
					trailContext.textBaseline="middle";
					trailContext.fillText("initial height="+h0+"m",trailCanvas.width*0.35-padding,theCanvas.height-(h0/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius)+ball_radius);

					trailContext.setLineDash([2, 3]);
					trailContext.beginPath();
					trailContext.moveTo(theCanvas.width*0.35, theCanvas.height-(h0/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius)+ball_radius);
					trailContext.lineTo(theCanvas.width*0.65, theCanvas.height-(h0/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius)+ball_radius);
					trailContext.stroke();



			}
		}

  

		