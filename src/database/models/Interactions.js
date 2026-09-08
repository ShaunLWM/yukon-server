import BaseModel from '../BaseModel'


export default class Interactions extends BaseModel {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                interaction: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    primaryKey: true
                }
            },
            { sequelize, timestamps: false, tableName: 'interactions' }
        )
    }

    static associate({ users }) {
        this.belongsTo(users, {
            foreignKey: 'userId'
        })
    }

}
