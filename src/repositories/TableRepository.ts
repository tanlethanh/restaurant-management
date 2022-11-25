import { Prisma, ReservationState, TableState } from '@prisma/client';
import PrismaDB from "../prisma/PrismaDB";
import { randomNumber } from '../utils/mathUtils';

const tableSeats = [2, 4, 8]


class TableRepository {

    public async generateRandomTables(count: number) {
        const tables: Prisma.TableCreateInput[] = []

        const tableSeatsLength = tableSeats.length
        for (let index = 0; index < count; index++) {
            const newTable: Prisma.TableCreateInput = {
                numberOfSeats: tableSeats[randomNumber(0, tableSeatsLength - 1)],
                state: TableState.FREE
            }
            tables.push(newTable)
        }

        const createdTables = await PrismaDB.table.createMany({
            data: tables
        })

        return createdTables
    }

    public async getAllSortedTables() {
        return await PrismaDB.table.findMany({
            orderBy: {
                tableNumber: "asc"
            }
        })
    }

    public async getTableWithReservationsById(id: string) {
        return await PrismaDB.table.findUnique({
            where: {
                id: id
            },
            include: {
                reservations: true
            }
        })
    }

    public async updateTableStateById(id: string, state: TableState) {
        return await PrismaDB.table.update({
            where: {
                id: id
            },
            data: {
                state: state
            },
            include: {
                reservations: {
                    where: {
                        state: ReservationState.READY
                    }
                }
            }
        })
    }

}

export default new TableRepository