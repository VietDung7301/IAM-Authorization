exports.getScopesFromRoleId = async (roleId) => {
    const role = await DB_CONNECTION.models.Role.findOne({
        where: {
            id: roleId
        },
        include: DB_CONNECTION.models.Scope
    })

    if (role == null)
        return false
    
    let scopes = ''
    for (const scope of role.Scopes) 
        scopes = scopes + scope.title + ' '
    
    return scopes.trim()
}