// import {RangeSlider} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { Form,InputGroup } from 'react-bootstrap'

const {Label, Range} = Form

const ThresholdSlider = ({initialThreshold, onThresholdChange}) => {
    const [threshold,setThreshold] = useState(initialThreshold)

    const onToggle = (newThreshold) => {
        setThreshold(newThreshold)
        onThresholdChange(newThreshold)
    }
    useEffect(() =>
        setThreshold(initialThreshold),
        [initialThreshold]
    )

    console.log('Threshold Render!')
    return(
        <>
            <Label style={{textAlign:'center',fontSize:'large'}}>
                Change filter threshold
            </Label>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Current value:</InputGroup.Text>
                <Form.Control
                placeholder="value"
                aria-label="Number between 0 and 9"
                aria-describedby="basic-addon1"
                value={threshold}
                type="number"
                onChange={e=>onToggle(e.target.value)}
                />
            </InputGroup>
            <Range min={0} max={9} value={threshold} onChange={e => onToggle(e.target.value)}>

            </Range>
        </>
        // <RangeSlider>
        // </RangeSlider>
    )
}

export default ThresholdSlider;