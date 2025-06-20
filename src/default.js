class TrulienceSDK {
  static InitState = {
    NOT_INITIATED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    FAILED: 3,
  };

  // Private static variables
  static #trulienceClass = null;
  static #libraryLoadPromise = null;
  static #libraryLoaded = false;

  // Instance variables
  #initState = TrulienceSDK.InitState.NOT_INITIATED;

  // Enums
  static TGStatus = null;
  static AvatarStatus = null;
  static MessageType = null;
  static CallEndReason = null;
  static DigitalHumanType = null;

  constructor() {}

  // Private Methods
  static #loadScript(url, idVal) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.id = idVal;

      // Resolve the promise when the script is loaded successfully
      script.onload = () => {
        resolve();
      };

      // Reject the promise if the script fails to load
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`));
      };

      // Append the script to the document head or body
      document.head.appendChild(script);
    });
  }

  static #loadTrulienceLibrary = (url) => {
    // If the library has already been loaded, return the resolved promise
    if (TrulienceSDK.#libraryLoaded) {
      console.log(
        'Ignoring Trulience library load request because already loaded.'
      );
      return Promise.resolve(TrulienceSDK.#trulienceClass);
    }

    // If the library is already being loaded, return the existing promise
    if (TrulienceSDK.#libraryLoadPromise) {
      return TrulienceSDK.#libraryLoadPromise;
    }

    // Otherwise, start loading the library and store the promise
    TrulienceSDK.#libraryLoadPromise = new Promise((resolve, reject) => {
      if (TrulienceSDK.#trulienceClass) {
        TrulienceSDK.#libraryLoaded = true;
        resolve(TrulienceSDK.#trulienceClass);
        return;
      }

      TrulienceSDK.#loadScript(url, 'trulience-sdk-script')
        .then(() => {
          TrulienceSDK.#trulienceClass = window.Trulience; // Assuming the library attaches itself to the window object
          if (!TrulienceSDK.#trulienceClass) {
            console.error('Trulience class not found on window object');
            reject(new Error('Trulience class not found'));
            return;
          }

          console.log('Trulience class loaded successfully');
          TrulienceSDK.#libraryLoaded = true;
          resolve(TrulienceSDK.#trulienceClass);
        })
        .catch((err) => {
          console.error('Error loading Trulience library:', err);
          reject(err);
          return;
        });
    });

    return TrulienceSDK.#libraryLoadPromise;
  };

  #setupEnums(Trulience) {
    TrulienceSDK.MessageType = Trulience.MessageType;
    TrulienceSDK.CallEndReason = Trulience.CallEndReason;
    TrulienceSDK.AvatarStatus = Trulience.AvatarStatus;
    TrulienceSDK.DigitalHumanType = Trulience.DigitalHumanType;
    TrulienceSDK.TGStatus = Trulience.TGStatus;
  }

  // Public Methods
  initSDK(url, details) {
    return new Promise((resolve, reject) => {
      if (this.#initState === TrulienceSDK.InitState.IN_PROGRESS) {
        console.log(
          'Ignoring initializeTrulienceSDK because already in progress'
        );
        reject('Already in Progress');
        return;
      }

      this.#initState = TrulienceSDK.InitState.IN_PROGRESS;

      // get overriden url from url param if provided
      let urlParams = new URLSearchParams(window.location.search);
      let param = urlParams.get('TRULIENCE_SDK_URL');
      if (param) {
        url = param;
        console.warn('LOADING OVERRIDE SDK URL', url);
      }

      TrulienceSDK.#loadTrulienceLibrary(url)
        .then((Trulience) => {
          this.#setupEnums(Trulience);

          // If dhType is not provided, default is CUSTOM dh type.
          const dhType = details.dhType
            ? details.dhType
            : Trulience.DigitalHumanType.CUSTOM;
          const enableAvatar =
            dhType === Trulience.DigitalHumanType.WEBGL ? false : true;

          // Create the object to work with if initialized.
          const trulienceObj = Trulience.Builder()
            .setAvatarId(details.avatarId ? details.avatarId : '')
            .setToken(details.token ? details.token : null)
            .setUserName(details.username ? details.username : 'Guest')
            .enableAvatar(enableAvatar !== undefined ? enableAvatar : true)
            .setRetry(details.retry !== undefined ? details.retry : false)
            .registerVideoElements(
              details.videoElements ? details.videoElements : null
            )
            .setEnvParams(
              details.envParams !== undefined ? details.envParams : {}
            )
            .setAvatarParams(
              details.avatarParams !== undefined ? details.avatarParams : {}
            )
            .build();

          // Set the notification listeners
          if (details.eventCallbacks) {
            Object.entries(details.eventCallbacks || {}).forEach(
              ([key, value]) => {
                trulienceObj.on(key, value);
              }
            );
          }
          this.#initState = TrulienceSDK.InitState.COMPLETED;
          resolve(trulienceObj);
        })
        .catch((error) => {
          console.error('error in initSDK - ', error);
          this.#initState = TrulienceSDK.InitState.FAILED;
          reject(error);
        });
    });
  }

  isInitialized = () => {
    return this.#initState === TrulienceSDK.InitState.COMPLETED;
  };
}

export default TrulienceSDK;
