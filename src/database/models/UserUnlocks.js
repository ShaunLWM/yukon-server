import BaseModel from '../BaseModel'


export default class UserUnlocks extends BaseModel {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                code: {
                    type: DataTypes.STRING(45),
                    allowNull: true
                }
            },
            { sequelize, timestamps: false, tableName: 'user_unlocks' }
        )
    }

}
