class ApiCom {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
  }

  export function sendToLocalStorage() {

    const element = document.querySelector<HTMLDivElement>('#add')!
    let apiCom = new ApiCom()
    apiCom.id = self.crypto.randomUUID();
    apiCom.name = element.querySelector('#name')?.nodeValue || '';
    apiCom.description = element.querySelector('#desc')?.nodeValue || '';

    let counter = parseInt(localStorage.getItem('clickCounter') || '0')
    
    const storeUser = (user: ApiCom) => {
        localStorage.setItem('apiCom.id', JSON.stringify(user));
    };
  }
  
  