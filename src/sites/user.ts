import { getActiveUserId } from "./main";
import LocalStorageUserCrud from '../operations/LocalStorageUserCrud';

export function renderUser()
{
    const user = LocalStorageUserCrud.getById(getActiveUserId());
    return `<div class = "m-2 p-2"> <p><strong>Login: </strong> ${user.username} </p>
    <p><strong>Imie: </strong> ${user.firstname} </p>
    <p><strong>Nazwisko: </strong> ${user.lastname} </p>
    <p><strong>Rola: </strong> ${user.role} </p> </div>`;
}
