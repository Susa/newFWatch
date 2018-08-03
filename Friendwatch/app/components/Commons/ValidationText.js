import React from 'react'
import { Text } from 'react-native'

const ValidationText = (props) => {
    let textColor = 'red'
    let { getFieldError } = props.form

    return <Text style={{ marginLeft: 10, color: textColor }}>
        {(getFieldError(props.field) || []).join(', ')}
    </Text>
        
}

export default ValidationText