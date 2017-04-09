'use_strict';

class EnvelopGui {
    constructor(envelop) {
        this.envelop = envelop;
        this.envelopGui = document.createElement('div');
        this.envelopGui.id = 'envelopGui';
        this.envelopGui.innerHTML = this.template();
        document.body.appendChild(this.envelopGui);

        this.envelop.labels.forEach((label) => {
            label.visible = false;
        });

        this.domEvents.call(this);
    }
    template() {
        let templateString = '\
        <img style="height: 75px; width: 75px;" src="assets/logo_envelop.png"/>\
        <div style= "text-align: left; padding: 5px 10px" >\
            <label  for="viewLabelsToggle" style="font-weight: 500; vertical-align: middle;"> Labels: </label>\
            <input type="checkbox" id="viewLabelsToggle"/>\
        </div>\
        <div style= "text-align: left; padding: 5px 10px 0 10px" >\
            <label  for="viewSpeakersToggle" style="font-weight: 500; vertical-align: middle;"> Speakers: </label>\
            <input type="checkbox" id="viewSpeakersToggle" checked/>\
        </div>\
        <ol>';

        let speakerNumber = 1;
        for (let speaker in this.envelop.speakers) {
            templateString += '<li id="meter_' + speakerNumber + '"></li>';
            speakerNumber++;
        }
        templateString += '</ol>\
            <div style= "text-align: left; padding: 0 10px" >\
            <label  for="viewInputsToggle" style="font-weight: 500; vertical-align: middle;"> Inputs: </label>\
            <input type="checkbox" id="viewInputsToggle" checked/>\
        </div>\
        <div style="text-align: left; ">';

        let inputNumber = 1;
        for (let input in this.envelop.inputs) {
            templateString += '<h5 style="margin: 10px 10px 0; display:inline-block">' + inputNumber + '</h5>';
            templateString += '<p style="font-size:14px; margin: -2px 0 0 0; display:inline-block">  0, 0, 0</p><br>';
            inputNumber++;
        }
        
        // templateString += '<input style="width: 90%; margin: 20px 10px;" type="text" placeholder="WebSocket Server Address"/>';

        return templateString;
    }
    domEvents() {
        let viewLabels = this.envelopGui.querySelector('#viewLabelsToggle');
        viewLabels.onchange = (event) => {
            let labelStatus = true;

            if (!event.target.checked) {
                labelStatus = false;
            }

            this.envelop.labels.forEach((label) => {
                label.visible = labelStatus;
            });
        }

        let viewSpeakers = this.envelopGui.querySelector('#viewSpeakersToggle');
        viewSpeakers.onchange = (event) => {
            let viewStatus = true;

            if (!event.target.checked) {
                viewStatus = false;
            }

            for(let speaker in this.envelop.speakers) {
                this.envelop.speakers[speaker].visible = viewStatus;
            }

            this.envelop.subs.forEach((sub) => {
                sub.visible = viewStatus;
            });

            this.envelop.columns.forEach((column) => {
                column.mesh.visible = viewStatus;
            });

            this.envelop.floor.visible = viewStatus;
        };

        let viewInputs = this.envelopGui.querySelector('#viewInputsToggle');
        viewInputs.onchange = (event) => {
            let viewStatus = true;

            if (!event.target.checked) {
                viewStatus = false;
            }
            for (let input in this.envelop.inputs) {
                this.envelop.inputs[input].visible = viewStatus;
            }
        };
    }
}

module.exports = EnvelopGui;