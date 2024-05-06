/* import alt from 'alt-server'

alt.on('resourceStart',  () => {
    const player = alt.Player.getByID(1)
    const ped = new alt.Ped('CS_Hunter', player.pos, player.rot, 10)

    alt.setTimeout(() => {
        ped.setNetOwner(player)
        ped.netOwner.emit('ped_spawn', ped)
    }, 2500)
})

alt.onClient('delete', (_, entity: alt.Ped) => {
    entity.destroy()
}) */