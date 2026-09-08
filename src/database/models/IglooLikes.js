import BaseModel from '../BaseModel'


export default class IglooLikes extends BaseModel {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                iglooUserId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                }
            },
            { sequelize, timestamps: false, tableName: 'igloo_likes' }
        )
    }

    static associate({ users }) {
        this.belongsTo(users, { foreignKey: 'userId' })
    }

}
