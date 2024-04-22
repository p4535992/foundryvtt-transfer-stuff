export function retrieveAllOwnedActors() {
    const options = game.actors.reduce((acc, actor) => {
        if (actor.isOwner) {
            return acc + `<option value="${actor.id}">${actor.name}</option>`;
        }
        return acc;
    }, "");
    return options;
}
