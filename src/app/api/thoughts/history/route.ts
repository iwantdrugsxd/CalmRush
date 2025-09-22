import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const thoughts = await prisma.thoughtHistory.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: thoughts })
  } catch (error) {
    console.error('Error fetching thought history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch thought history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Handle bulk solutions (from playground reset)
    if (body.solutions && Array.isArray(body.solutions)) {
      const solutions = body.solutions.map((solution: {problem: string, solution: string}) => ({
        problem: solution.problem,
        solution: solution.solution,
        userId
      }))

      const thoughtHistory = await prisma.thoughtHistory.createMany({
        data: solutions
      })

      return NextResponse.json({
        success: true,
        data: { count: thoughtHistory.count, message: 'Bulk solutions saved successfully' }
      })
    }

    // Handle single solution (existing functionality)
    const { problem, solution } = body

    if (!problem || !solution) {
      return NextResponse.json(
        { success: false, error: 'Problem and solution are required' },
        { status: 400 }
      )
    }

    const thoughtHistory = await prisma.thoughtHistory.create({
      data: {
        problem,
        solution,
        userId
      }
    })

    return NextResponse.json({
      success: true,
      data: thoughtHistory
    })
  } catch (error) {
    console.error('Error creating thought history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create thought history' },
      { status: 500 }
    )
  }
}
