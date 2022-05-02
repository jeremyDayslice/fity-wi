let get = async () => {
    return {
        status: 200, 
        body: [{
            'question': 'How tall is the Empire State Building?',
            'answers': ['10 ft', '10000 ft', 'a million ft', '6 inches'],
            'right': 2
        }]
    }
}

export {
    get
}