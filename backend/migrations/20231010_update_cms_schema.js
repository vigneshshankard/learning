const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create MaterialVersion table
    await queryInterface.createTable('MaterialVersion', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studyMaterialId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'StudyMaterial',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      versionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add new fields to StudyMaterial table
    await queryInterface.addColumn('StudyMaterial', 'currentVersionId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'MaterialVersion',
        key: 'id',
      },
    });

    await queryInterface.addColumn('StudyMaterial', 'status', {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    });

    await queryInterface.addColumn('StudyMaterial', 'createdBy', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    await queryInterface.addColumn('StudyMaterial', 'updatedBy', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    // Add indexes
    await queryInterface.addIndex('MaterialVersion', ['studyMaterialId']);
    await queryInterface.addIndex('MaterialVersion', ['versionNumber']);
  },

  down: async (queryInterface) => {
    // Remove indexes
    await queryInterface.removeIndex('MaterialVersion', ['studyMaterialId']);
    await queryInterface.removeIndex('MaterialVersion', ['versionNumber']);

    // Remove columns from StudyMaterial table
    await queryInterface.removeColumn('StudyMaterial', 'currentVersionId');
    await queryInterface.removeColumn('StudyMaterial', 'status');
    await queryInterface.removeColumn('StudyMaterial', 'createdBy');
    await queryInterface.removeColumn('StudyMaterial', 'updatedBy');

    // Drop MaterialVersion table
    await queryInterface.dropTable('MaterialVersion');
  },
};