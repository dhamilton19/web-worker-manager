let worker = null;
let isWorkerInitialised = false;

const initialise = (path, type) => {
    if(!worker && !isWorkerInitialised) {
        switch(type){
            // case SHARED:
            //     worker = new SharedWorker(path);
            //     break;
            case DEDICATED:
            default:
                worker = new Worker(path);
                break;
        }
        console.log('Created dedicated worker');
        isWorkerInitialised = true;
    }
    else throw Error('worker-manger is already initialised.');
};

const terminate = () => {
    worker.terminate();
    worker = null;
    isWorkerInitialised = false;
};

const _isInitialised = () => {
    if(!isWorkerInitialised) throw Error('Must initialise worker-manager');
};

const postMessage = action => {
    _isInitialised();
    if(!action.type) throw Error('Must have an action type');
    const id = Date.now();
    return new Promise((resolve) => {

        worker.onmessage = message => {
            const parsedMessage = _receieve(message);
            if(parsedMessage.id === id) {
                resolve(parsedMessage);
            }
        };

        _send({
            ...action,
            id
        });
    });
};

const _send = action => {
    worker.postMessage(action);
};

const _receieve = e  => {
    return e.data;
};

const SHARED = 'SHARED';
const DEDICATED = 'DEDICATED';

export default {
    initialise,
    terminate,
    postMessage,
    SHARED,
    DEDICATED
};
