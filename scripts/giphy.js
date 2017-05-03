let request = require('sync-request');

exports.giphy = function(bot) {
    return {
        name: 'gif search',
        commands: ['gif', 'giphy'],
        isCommand: true,
        private: false,
        rtn: (from, message) => {

            let res = request('GET','http://api.giphy.com/v1/gifs/translate?s='+encodeURIComponent(message.replace(' ', '+'))+'&api_key=dc6zaTOxFJmzC');
            try {
                let data = JSON.parse(res.getBody());
		if(data.data)
                    return data.data.url;
                return 'No media found.';
            } catch (e) {
                console.log(e);
            }
        }
    }

};
